-- =========================================
-- VISTA HABITACIONES DISPONIBLES
-- =========================================

CREATE OR REPLACE VIEW vista_habitaciones_disponibles AS
SELECT
    h.id_habitacion,
    h.numero_habitacion,
    h.numero_piso,

    th.nombre AS tipo_habitacion,
    th.capacidad,
    th.precio_por_noche,

    h.estado

FROM habitaciones h

INNER JOIN tipos_habitacion th
ON h.id_tipo_habitacion = th.id_tipo_habitacion

WHERE h.estado = 'disponible';

-- =========================================
-- VISTA HUESPEDES ACTUALES
-- =========================================

CREATE OR REPLACE VIEW vista_huespedes_actuales AS
SELECT
    r.id_reserva,

    hu.nombres,
    hu.apellidos,

    h.numero_habitacion,

    r.fecha_check_in,
    r.fecha_check_out,

    CURRENT_DATE - r.fecha_check_in
    AS dias_transcurridos

FROM reservas r

INNER JOIN huespedes hu
ON r.id_huesped = hu.id_huesped

INNER JOIN habitaciones h
ON r.id_habitacion = h.id_habitacion

WHERE r.estado = 'en_curso';

-- vistas materializadas 

-- =========================================
-- MATERIALIZED VIEW OCUPACION MENSUAL
-- =========================================

CREATE MATERIALIZED VIEW vista_ocupacion_mensual AS
SELECT

    DATE_TRUNC('month', r.fecha_check_in)
    AS mes,

    th.nombre AS tipo_habitacion,

    COUNT(r.id_reserva)
    AS total_reservas,

    SUM(r.total_estimado)
    AS ingresos_hospedaje,

    COALESCE(SUM(ce.subtotal), 0)
    AS ingresos_consumos

FROM reservas r

INNER JOIN habitaciones h
ON r.id_habitacion = h.id_habitacion

INNER JOIN tipos_habitacion th
ON h.id_tipo_habitacion = th.id_tipo_habitacion

LEFT JOIN consumos_extra ce
ON r.id_reserva = ce.id_reserva

GROUP BY
DATE_TRUNC('month', r.fecha_check_in),
th.nombre;

-- =========================================
-- MATERIALIZED VIEW TOP HUESPEDES
-- =========================================

CREATE MATERIALIZED VIEW vista_top_huespedes AS
SELECT

    hu.id_huesped,

    hu.nombres,
    hu.apellidos,

    COUNT(r.id_reserva)
    AS total_estadias,

    SUM(f.monto_total)
    AS gasto_total

FROM huespedes hu

INNER JOIN reservas r
ON hu.id_huesped = r.id_huesped

INNER JOIN facturas f
ON r.id_reserva = f.id_reserva

GROUP BY
hu.id_huesped,
hu.nombres,
hu.apellidos;