-- =========================================
-- FUNCION CALCULAR TOTAL RESERVA
-- =========================================

CREATE OR REPLACE FUNCTION calcular_total_reserva(
    p_id_habitacion INT,
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS
$$
DECLARE
    v_precio NUMERIC;
    v_dias INT;
BEGIN

    SELECT th.precio_por_noche
    INTO v_precio
    FROM habitaciones h
    INNER JOIN tipos_habitacion th
    ON h.id_tipo_habitacion = th.id_tipo_habitacion
    WHERE h.id_habitacion = p_id_habitacion;

    v_dias := p_fecha_fin - p_fecha_inicio;

    RETURN v_precio * v_dias;

END;
$$;

-- =========================================
-- FUNCION OBTENER SALDO RESERVA
-- =========================================

CREATE OR REPLACE FUNCTION obtener_saldo_reserva(
    p_id_reserva INT
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS
$$
DECLARE
    v_total_factura NUMERIC;
    v_total_pagado NUMERIC;
BEGIN

    SELECT monto_total
    INTO v_total_factura
    FROM facturas
    WHERE id_reserva = p_id_reserva;

    SELECT COALESCE(SUM(monto), 0)
    INTO v_total_pagado
    FROM pagos p
    INNER JOIN facturas f
    ON p.id_factura = f.id_factura
    WHERE f.id_reserva = p_id_reserva;

    RETURN v_total_factura - v_total_pagado;

END;
$$;

-- =========================================
-- FUNCION HABITACIONES DISPONIBLES
-- =========================================

CREATE OR REPLACE FUNCTION obtener_habitaciones_disponibles(
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_id_tipo_habitacion INT
)
RETURNS TABLE (
    id_habitacion INT,
    numero_habitacion VARCHAR,
    numero_piso INT
)
LANGUAGE plpgsql
AS
$$
BEGIN

    RETURN QUERY

    SELECT
        h.id_habitacion,
        h.numero_habitacion,
        h.numero_piso

    FROM habitaciones h

    WHERE h.id_tipo_habitacion = p_id_tipo_habitacion

    AND h.estado != 'mantenimiento'

    AND h.id_habitacion NOT IN (

        SELECT r.id_habitacion

        FROM reservas r

        WHERE r.estado IN (
            'confirmada',
            'en_curso'
        )

        AND (
            p_fecha_inicio < r.fecha_check_out
            AND
            p_fecha_fin > r.fecha_check_in
        )
    );

END;
$$;