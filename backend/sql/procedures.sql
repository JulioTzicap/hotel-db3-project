-- =========================================
-- PROCEDURE REALIZAR RESERVA
-- =========================================

CREATE OR REPLACE PROCEDURE realizar_reserva(
    p_id_huesped INT,
    p_id_habitacion INT,
    p_fecha_check_in DATE,
    p_fecha_check_out DATE,
    p_cantidad_huespedes INT
)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_estado_habitacion VARCHAR(20);

    v_capacidad INT;

    v_existe_solape INT;

    v_total NUMERIC;

    v_id_reserva INT;
BEGIN

    -- =========================================
    -- BLOQUEAR HABITACION (CONCURRENCIA)
    -- =========================================

    SELECT estado
    INTO v_estado_habitacion
    FROM habitaciones
    WHERE id_habitacion = p_id_habitacion
    FOR UPDATE;

    -- =========================================
    -- VALIDAR HABITACION
    -- =========================================

    IF NOT FOUND THEN
        RAISE EXCEPTION
        'La habitación no existe';
    END IF;

    -- =========================================
    -- VALIDAR MANTENIMIENTO
    -- =========================================

    IF v_estado_habitacion = 'mantenimiento' THEN
        RAISE EXCEPTION
        'La habitación está en mantenimiento';
    END IF;

    -- =========================================
    -- VALIDAR CAPACIDAD
    -- =========================================

    SELECT th.capacidad
    INTO v_capacidad
    FROM habitaciones h
    INNER JOIN tipos_habitacion th
    ON h.id_tipo_habitacion = th.id_tipo_habitacion
    WHERE h.id_habitacion = p_id_habitacion;

    IF p_cantidad_huespedes > v_capacidad THEN
        RAISE EXCEPTION
        'La cantidad de huéspedes excede la capacidad';
    END IF;

    -- =========================================
    -- VALIDAR SOLAPE
    -- =========================================

    SELECT COUNT(*)
    INTO v_existe_solape
    FROM reservas
    WHERE id_habitacion = p_id_habitacion

    AND estado IN (
        'confirmada',
        'en_curso'
    )

    AND (
        p_fecha_check_in < fecha_check_out
        AND
        p_fecha_check_out > fecha_check_in
    );

    IF v_existe_solape > 0 THEN
        RAISE EXCEPTION
        'Ya existe una reserva en esas fechas';
    END IF;

    -- =========================================
    -- CALCULAR TOTAL
    -- =========================================

    v_total := calcular_total_reserva(
        p_id_habitacion,
        p_fecha_check_in,
        p_fecha_check_out
    );

    -- =========================================
    -- CREAR RESERVA
    -- =========================================

    INSERT INTO reservas
    (
        id_huesped,
        id_habitacion,
        fecha_check_in,
        fecha_check_out,
        cantidad_huespedes,
        total_estimado,
        estado
    )
    VALUES
    (
        p_id_huesped,
        p_id_habitacion,
        p_fecha_check_in,
        p_fecha_check_out,
        p_cantidad_huespedes,
        v_total,
        'confirmada'
    )
    RETURNING id_reserva
    INTO v_id_reserva;

    -- =========================================
    -- CREAR FACTURA
    -- =========================================

    INSERT INTO facturas
    (
        id_reserva,
        monto_total,
        estado
    )
    VALUES
    (
        v_id_reserva,
        v_total,
        'pendiente'
    );

    -- =========================================
    -- AUDITORIA
    -- =========================================

    INSERT INTO auditoria_logs
    (
        tipo_operacion,
        descripcion
    )
    VALUES
    (
        'CREAR_RESERVA',
        'Reserva creada correctamente'
    );

EXCEPTION
    WHEN OTHERS THEN

        RAISE NOTICE
        'Error al realizar reserva: %',
        SQLERRM;

        RAISE;
END;
$$;

-- =========================================
-- PROCEDURE REALIZAR CHECKOUT
-- =========================================

CREATE OR REPLACE PROCEDURE realizar_checkout(
    p_id_reserva INT,
    p_monto_pago NUMERIC,
    p_metodo_pago VARCHAR(50)
)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_estado_reserva VARCHAR(20);

    v_total_hospedaje NUMERIC;

    v_total_consumos NUMERIC;

    v_total_final NUMERIC;

    v_id_factura INT;

    v_id_habitacion INT;
BEGIN

    -- =========================================
    -- VALIDAR RESERVA
    -- =========================================

    SELECT
        estado,
        total_estimado,
        id_habitacion

    INTO
        v_estado_reserva,
        v_total_hospedaje,
        v_id_habitacion

    FROM reservas

    WHERE id_reserva = p_id_reserva

    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION
        'La reserva no existe';
    END IF;

    -- =========================================
    -- VALIDAR ESTADO
    -- =========================================

    IF v_estado_reserva != 'en_curso' THEN
        RAISE EXCEPTION
        'La reserva no está en curso';
    END IF;

    -- =========================================
    -- TOTAL CONSUMOS
    -- =========================================

    SELECT COALESCE(SUM(subtotal), 0)
    INTO v_total_consumos
    FROM consumos_extra
    WHERE id_reserva = p_id_reserva;

    -- =========================================
    -- TOTAL FINAL
    -- =========================================

    v_total_final :=
        v_total_hospedaje
        +
        v_total_consumos;

    -- =========================================
    -- OBTENER FACTURA
    -- =========================================

    SELECT id_factura
    INTO v_id_factura
    FROM facturas
    WHERE id_reserva = p_id_reserva;

    -- =========================================
    -- ACTUALIZAR FACTURA
    -- =========================================

    UPDATE facturas
    SET
        monto_total = v_total_final,
        estado = 'pagada'
    WHERE id_factura = v_id_factura;

    -- =========================================
    -- REGISTRAR PAGO
    -- =========================================

    INSERT INTO pagos
    (
        id_factura,
        monto,
        metodo_pago
    )
    VALUES
    (
        v_id_factura,
        p_monto_pago,
        p_metodo_pago
    );

    -- =========================================
    -- COMPLETAR RESERVA
    -- =========================================

    UPDATE reservas
    SET estado = 'completada'
    WHERE id_reserva = p_id_reserva;

    -- =========================================
    -- HABITACION A LIMPIEZA
    -- =========================================

    UPDATE habitaciones
    SET estado = 'limpieza'
    WHERE id_habitacion = v_id_habitacion;

    -- =========================================
    -- AUDITORIA
    -- =========================================

    INSERT INTO auditoria_logs
    (
        tipo_operacion,
        descripcion
    )
    VALUES
    (
        'CHECK_OUT',
        'Check-out realizado correctamente'
    );

EXCEPTION
    WHEN OTHERS THEN

        RAISE NOTICE
        'Error en checkout: %',
        SQLERRM;

        RAISE;
END;
$$;