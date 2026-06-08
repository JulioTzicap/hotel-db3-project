-- ============================================================
-- SEED MASIVO PARA BASE DE DATOS HOTEL
-- Reemplaza el archivo sql/seeds.sql
-- Contiene:
-- - 4 tipos de habitación
-- - 50 habitaciones en 5 pisos
-- - 80 huéspedes
-- - 250 reservas en últimos 12 meses, incluyendo en_curso
-- - 800 consumos extra
-- - 200 facturas con pagos completos y parciales
-- ============================================================

TRUNCATE TABLE
    pagos,
    facturas,
    consumos_extra,
    servicios_extra,
    reservas,
    habitaciones,
    tipos_habitacion,
    huespedes,
    auditoria_logs
RESTART IDENTITY CASCADE;

-- ============================================================
-- TIPOS DE HABITACIÓN
-- ============================================================

INSERT INTO tipos_habitacion
(nombre, descripcion, capacidad, precio_por_noche, comodidades)
VALUES
('Individual', 'Habitación sencilla para una persona.', 1, 275.00, ARRAY['WiFi', 'TV', 'Escritorio']),
('Doble', 'Habitación cómoda para dos personas.', 2, 425.00, ARRAY['WiFi', 'TV', 'Aire acondicionado']),
('Familiar', 'Habitación amplia para familias o grupos pequeños.', 4, 725.00, ARRAY['WiFi', 'TV', 'Aire acondicionado', 'Mini bar']),
('Suite', 'Habitación premium con sala privada y mejores comodidades.', 6, 1300.00, ARRAY['WiFi', 'TV', 'Jacuzzi', 'Sala privada', 'Mini bar']);

-- ============================================================
-- HABITACIONES: 50 HABITACIONES, 10 POR PISO, 5 PISOS
-- ============================================================

INSERT INTO habitaciones
(numero_habitacion, numero_piso, id_tipo_habitacion, estado)
SELECT
    CONCAT(piso, LPAD(num::TEXT, 2, '0')) AS numero_habitacion,
    piso AS numero_piso,
    CASE
        WHEN num IN (1,2,3) THEN 1
        WHEN num IN (4,5,6) THEN 2
        WHEN num IN (7,8,9) THEN 3
        ELSE 4
    END AS id_tipo_habitacion,
    CASE
        WHEN piso = 5 AND num IN (9,10) THEN 'mantenimiento'
        WHEN piso = 4 AND num = 10 THEN 'limpieza'
        ELSE 'disponible'
    END AS estado
FROM generate_series(1,5) AS piso
CROSS JOIN generate_series(1,10) AS num;

-- ============================================================
-- HUÉSPEDES: 80 PERFILES VARIADOS
-- ============================================================

WITH nombres AS (
    SELECT ARRAY[
        'Juan','María','Carlos','Ana','Luis','Sofía','Miguel','Lucía','José','Valeria',
        'Pedro','Camila','Diego','Andrea','Jorge','Paola','Fernando','Gabriela','Ricardo','Daniela',
        'Oscar','Natalia','Alejandro','Fernanda','Hugo','Elena','Manuel','Isabel','Rodrigo','Laura',
        'Pablo','Claudia','Emilio','Karla','Mateo','Diana','Raúl','Mónica','Sergio','Patricia'
    ] AS lista
), apellidos AS (
    SELECT ARRAY[
        'Pérez','López','Ramírez','Martínez','Hernández','Castillo','Morales','Ortega','García','Méndez',
        'Gómez','Ruiz','Flores','Vásquez','Reyes','Cruz','Aguilar','Rodas','Molina','Chávez',
        'Santos','Herrera','Navarro','Escobar','Mejía','Alvarado','Fuentes','Cabrera','Romero','Díaz'
    ] AS lista
), paises AS (
    SELECT ARRAY[
        'Guatemala','México','El Salvador','Honduras','Costa Rica','Panamá','Colombia','Argentina',
        'España','Estados Unidos','Canadá','Chile','Perú','Brasil','Francia','Alemania'
    ] AS lista
)
INSERT INTO huespedes
(nombres, apellidos, correo, telefono, nacionalidad, numero_documento, fecha_creacion)
SELECT
    nombres.lista[((i - 1) % array_length(nombres.lista, 1)) + 1],
    apellidos.lista[((i - 1) % array_length(apellidos.lista, 1)) + 1],
    LOWER(
        nombres.lista[((i - 1) % array_length(nombres.lista, 1)) + 1] ||
        '.' ||
        apellidos.lista[((i - 1) % array_length(apellidos.lista, 1)) + 1] ||
        i || '@correo.com'
    ),
    '5555' || LPAD(i::TEXT, 4, '0'),
    paises.lista[((i - 1) % array_length(paises.lista, 1)) + 1],
    'DOC-' || LPAD(i::TEXT, 6, '0'),
    CURRENT_DATE - ((random() * 365)::INT)
FROM generate_series(1,80) AS i, nombres, apellidos, paises;

-- ============================================================
-- SERVICIOS EXTRA
-- ============================================================

INSERT INTO servicios_extra
(nombre, categoria, precio)
VALUES
('Desayuno buffet', 'Alimentos', 65.00),
('Almuerzo ejecutivo', 'Alimentos', 95.00),
('Cena especial', 'Alimentos', 125.00),
('Bebida natural', 'Alimentos', 30.00),
('Lavandería básica', 'Lavandería', 45.00),
('Lavandería completa', 'Lavandería', 90.00),
('Transporte aeropuerto', 'Transporte', 180.00),
('Tour local', 'Turismo', 250.00),
('Spa individual', 'Spa', 300.00),
('Decoración especial', 'Eventos', 225.00),
('Parqueo diario', 'Parqueo', 50.00),
('Servicio a la habitación', 'Atención', 40.00);

-- ============================================================
-- RESERVAS: 250 EN LOS ÚLTIMOS 12 MESES, CON VARIAS EN CURSO
-- ============================================================

WITH base AS (
    SELECT
        i,
        ((random() * 79)::INT + 1) AS id_huesped,
        ((random() * 49)::INT + 1) AS id_habitacion,
        ((random() * 5)::INT + 1) AS noches,
        random() AS r_estado,
        random() AS r_fecha
    FROM generate_series(1,250) AS i
), fechas AS (
    SELECT
        b.*,
        CASE
            WHEN i <= 25 THEN CURRENT_DATE - ((random() * 3)::INT)                         -- en curso
            WHEN i <= 45 THEN CURRENT_DATE + ((random() * 90)::INT + 1)                    -- futuras
            ELSE CURRENT_DATE - ((random() * 365)::INT + 1)                                -- últimos 12 meses
        END AS fecha_check_in
    FROM base b
), datos AS (
    SELECT
        f.i,
        f.id_huesped,
        f.id_habitacion,
        f.fecha_check_in,
        f.fecha_check_in + f.noches AS fecha_check_out,
        th.capacidad,
        th.precio_por_noche,
        CASE
            WHEN f.i <= 25 THEN 'en_curso'
            WHEN f.i <= 45 THEN 'confirmada'
            WHEN f.r_estado < 0.07 THEN 'cancelada'
            WHEN f.r_estado < 0.12 THEN 'no_show'
            WHEN f.r_estado < 0.22 THEN 'pendiente'
            ELSE 'completada'
        END AS estado
    FROM fechas f
    INNER JOIN habitaciones h ON f.id_habitacion = h.id_habitacion
    INNER JOIN tipos_habitacion th ON h.id_tipo_habitacion = th.id_tipo_habitacion
)
INSERT INTO reservas
(id_huesped, id_habitacion, fecha_check_in, fecha_check_out, cantidad_huespedes, total_estimado, estado, fecha_creacion)
SELECT
    id_huesped,
    id_habitacion,
    fecha_check_in,
    fecha_check_out,
    ((random() * (capacidad - 1))::INT + 1) AS cantidad_huespedes,
    ((fecha_check_out - fecha_check_in) * precio_por_noche)::NUMERIC(10,2) AS total_estimado,
    estado,
    fecha_check_in - ((random() * 30)::INT)
FROM datos;

-- Marcar como ocupadas algunas habitaciones con reservas en curso
UPDATE habitaciones h
SET estado = 'ocupada'
WHERE h.id_habitacion IN (
    SELECT DISTINCT id_habitacion
    FROM reservas
    WHERE estado = 'en_curso'
    LIMIT 15
);

-- ============================================================
-- CONSUMOS EXTRA: 800 CONSUMOS DE SERVICIOS
-- ============================================================

WITH base AS (
    SELECT
        i,
        ((random() * 249)::INT + 1) AS id_reserva,
        ((random() * 11)::INT + 1) AS id_servicio,
        ((random() * 3)::INT + 1) AS cantidad,
        random() AS r_fecha
    FROM generate_series(1,800) AS i
), datos AS (
    SELECT
        b.id_reserva,
        b.id_servicio,
        b.cantidad,
        s.precio,
        r.fecha_check_in,
        r.fecha_check_out,
        b.r_fecha
    FROM base b
    INNER JOIN servicios_extra s ON b.id_servicio = s.id_servicio
    INNER JOIN reservas r ON b.id_reserva = r.id_reserva
    WHERE r.estado NOT IN ('cancelada', 'no_show')
)
INSERT INTO consumos_extra
(id_reserva, id_servicio, cantidad, subtotal, fecha_consumo)
SELECT
    id_reserva,
    id_servicio,
    cantidad,
    (cantidad * precio)::NUMERIC(10,2) AS subtotal,
    fecha_check_in + ((GREATEST(fecha_check_out - fecha_check_in, 1) * r_fecha)::INT) + TIME '12:00'
FROM datos
LIMIT 800;

-- Si por canceladas/no_show no llegó a 800, completar con reservas válidas
INSERT INTO consumos_extra
(id_reserva, id_servicio, cantidad, subtotal, fecha_consumo)
SELECT
    r.id_reserva,
    s.id_servicio,
    1,
    s.precio,
    r.fecha_check_in + TIME '14:00'
FROM reservas r
CROSS JOIN servicios_extra s
WHERE r.estado NOT IN ('cancelada', 'no_show')
AND (SELECT COUNT(*) FROM consumos_extra) < 800
LIMIT GREATEST(0, 800 - (SELECT COUNT(*) FROM consumos_extra));

-- ============================================================
-- FACTURAS: 200 FACTURAS CON PAGOS COMPLETOS Y PARCIALES
-- ============================================================

WITH reservas_facturables AS (
    SELECT
        r.id_reserva,
        r.fecha_check_out,
        r.total_estimado + COALESCE(SUM(ce.subtotal), 0) AS monto_total,
        ROW_NUMBER() OVER (ORDER BY r.fecha_check_in, r.id_reserva) AS rn
    FROM reservas r
    LEFT JOIN consumos_extra ce ON r.id_reserva = ce.id_reserva
    WHERE r.estado NOT IN ('cancelada', 'no_show', 'pendiente')
    GROUP BY r.id_reserva, r.fecha_check_out, r.total_estimado, r.fecha_check_in
    LIMIT 200
)
INSERT INTO facturas
(id_reserva, monto_total, estado, fecha_creacion)
SELECT
    id_reserva,
    monto_total::NUMERIC(10,2),
    CASE
        WHEN rn <= 140 THEN 'pagada'
        ELSE 'parcial'
    END AS estado,
    fecha_check_out + TIME '10:00'
FROM reservas_facturables;

-- Pagos completos: facturas pagadas
INSERT INTO pagos
(id_factura, monto, metodo_pago, fecha_pago)
SELECT
    id_factura,
    monto_total,
    CASE
        WHEN id_factura % 4 = 0 THEN 'tarjeta_credito'
        WHEN id_factura % 4 = 1 THEN 'efectivo'
        WHEN id_factura % 4 = 2 THEN 'transferencia'
        ELSE 'tarjeta_debito'
    END AS metodo_pago,
    fecha_creacion + INTERVAL '2 hours'
FROM facturas
WHERE estado = 'pagada';

-- Pagos parciales: facturas parcialmente pagadas
INSERT INTO pagos
(id_factura, monto, metodo_pago, fecha_pago)
SELECT
    id_factura,
    ROUND((monto_total * (0.35 + random() * 0.45))::NUMERIC, 2) AS monto,
    CASE
        WHEN id_factura % 3 = 0 THEN 'tarjeta_credito'
        WHEN id_factura % 3 = 1 THEN 'transferencia'
        ELSE 'efectivo'
    END AS metodo_pago,
    fecha_creacion + INTERVAL '3 hours'
FROM facturas
WHERE estado = 'parcial';

-- ============================================================
-- AUDITORÍA: 4 TIPOS DE OPERACIÓN
-- ============================================================

INSERT INTO auditoria_logs
(tipo_operacion, descripcion, fecha_creacion)
VALUES
('CREATE_RESERVA', 'Carga inicial: creación masiva de reservas de prueba.', CURRENT_TIMESTAMP),
('CREATE_FACTURA', 'Carga inicial: generación de facturas para reservas.', CURRENT_TIMESTAMP),
('REGISTRO_PAGO', 'Carga inicial: registro de pagos completos y parciales.', CURRENT_TIMESTAMP),
('REFRESH_REPORTE', 'Carga inicial: datos listos para pruebas de vistas materializadas.', CURRENT_TIMESTAMP);

-- ============================================================
-- RESUMEN FINAL
-- ============================================================

SELECT 'tipos_habitacion' AS tabla, COUNT(*) AS total FROM tipos_habitacion
UNION ALL SELECT 'habitaciones', COUNT(*) FROM habitaciones
UNION ALL SELECT 'huespedes', COUNT(*) FROM huespedes
UNION ALL SELECT 'reservas', COUNT(*) FROM reservas
UNION ALL SELECT 'servicios_extra', COUNT(*) FROM servicios_extra
UNION ALL SELECT 'consumos_extra', COUNT(*) FROM consumos_extra
UNION ALL SELECT 'facturas', COUNT(*) FROM facturas
UNION ALL SELECT 'pagos', COUNT(*) FROM pagos
UNION ALL SELECT 'auditoria_logs', COUNT(*) FROM auditoria_logs;
