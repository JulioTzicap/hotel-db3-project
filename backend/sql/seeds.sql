-- =========================================
-- TIPOS DE HABITACION
-- =========================================

INSERT INTO tipos_habitacion
(
    nombre,
    descripcion,
    capacidad,
    precio_por_noche,
    comodidades
)
VALUES
(
    'Estándar',
    'Habitación estándar para dos personas',
    2,
    350.00,
    ARRAY[
        'WiFi',
        'TV',
        'Aire acondicionado'
    ]
),
(
    'Deluxe',
    'Habitación deluxe familiar',
    4,
    650.00,
    ARRAY[
        'WiFi',
        'TV',
        'Jacuzzi',
        'Mini bar'
    ]
),
(
    'Suite',
    'Suite premium con sala privada',
    6,
    1200.00,
    ARRAY[
        'WiFi',
        'TV',
        'Jacuzzi',
        'Sala privada'
    ]
),
(
    'Individual',
    'Habitación individual sencilla',
    1,
    250.00,
    ARRAY[
        'WiFi',
        'TV'
    ]
);

-- =========================================
-- HABITACIONES
-- =========================================

INSERT INTO habitaciones
(
    numero_habitacion,
    numero_piso,
    id_tipo_habitacion,
    estado
)
VALUES
('101',1,1,'disponible'),
('102',1,1,'disponible'),
('103',1,2,'disponible'),
('104',1,2,'mantenimiento'),

('201',2,1,'disponible'),
('202',2,1,'disponible'),
('203',2,2,'disponible'),
('204',2,3,'disponible'),

('301',3,1,'disponible'),
('302',3,2,'disponible'),
('303',3,3,'disponible'),
('304',3,4,'disponible'),

('401',4,1,'disponible'),
('402',4,2,'disponible'),
('403',4,3,'limpieza'),
('404',4,4,'disponible');

-- =========================================
-- HUESPEDES
-- =========================================

INSERT INTO huespedes
(
    nombres,
    apellidos,
    correo,
    telefono,
    nacionalidad,
    numero_documento
)
VALUES
(
    'Juan',
    'Pérez',
    'juan@gmail.com',
    '55550001',
    'Guatemala',
    'DPI001'
),
(
    'María',
    'López',
    'maria@gmail.com',
    '55550002',
    'México',
    'DPI002'
),
(
    'Carlos',
    'Ramírez',
    'carlos@gmail.com',
    '55550003',
    'El Salvador',
    'DPI003'
),
(
    'Ana',
    'Martínez',
    'ana@gmail.com',
    '55550004',
    'Guatemala',
    'DPI004'
),
(
    'Luis',
    'Hernández',
    'luis@gmail.com',
    '55550005',
    'Honduras',
    'DPI005'
),
(
    'Sofía',
    'Castillo',
    'sofia@gmail.com',
    '55550006',
    'Costa Rica',
    'DPI006'
),
(
    'Miguel',
    'Morales',
    'miguel@gmail.com',
    '55550007',
    'Guatemala',
    'DPI007'
),
(
    'Lucía',
    'Ortega',
    'lucia@gmail.com',
    '55550008',
    'Panamá',
    'DPI008'
);

-- =========================================
-- RESERVAS
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
    1,
    1,
    '2026-06-01',
    '2026-06-05',
    2,
    1400,
    'completada'
),
(
    2,
    3,
    '2026-06-10',
    '2026-06-15',
    3,
    3250,
    'confirmada'
),
(
    3,
    8,
    '2026-05-20',
    '2026-05-25',
    5,
    6000,
    'completada'
),
(
    4,
    5,
    '2026-06-03',
    '2026-06-08',
    2,
    1750,
    'en_curso'
),
(
    5,
    10,
    '2026-06-12',
    '2026-06-16',
    4,
    2600,
    'confirmada'
),
(
    6,
    11,
    '2026-04-01',
    '2026-04-04',
    4,
    3600,
    'completada'
),
(
    7,
    12,
    '2026-06-01',
    '2026-06-03',
    1,
    500,
    'completada'
),
(
    8,
    14,
    '2026-06-20',
    '2026-06-25',
    2,
    3250,
    'pendiente'
);

-- =========================================
-- SERVICIOS EXTRA
-- =========================================

INSERT INTO servicios_extra
(
    nombre,
    categoria,
    precio
)
VALUES
(
    'Mini bar',
    'Minibar',
    75
),
(
    'Lavandería',
    'Lavandería',
    120
),
(
    'Spa premium',
    'Spa',
    300
),
(
    'Cena romántica',
    'Restaurante',
    250
),
(
    'Transporte al aeropuerto',
    'Transporte',
    180
);

-- =========================================
-- CONSUMOS EXTRA
-- =========================================

INSERT INTO consumos_extra
(
    id_reserva,
    id_servicio,
    cantidad,
    subtotal
)
VALUES
(1,1,2,150),
(1,2,1,120),
(3,3,2,600),
(4,1,3,225),
(4,4,1,250),
(6,5,1,180),
(7,2,2,240);

-- =========================================
-- FACTURAS
-- =========================================

INSERT INTO facturas
(
    id_reserva,
    monto_total,
    estado
)
VALUES
(1,1670,'pagada'),
(2,3250,'pendiente'),
(3,6600,'pagada'),
(4,2225,'parcial'),
(5,2600,'pendiente'),
(6,3780,'pagada'),
(7,740,'pagada'),
(8,3250,'pendiente');

-- =========================================
-- PAGOS
-- =========================================

INSERT INTO pagos
(
    id_factura,
    monto,
    metodo_pago
)
VALUES
(1,1670,'Tarjeta'),
(3,6600,'Efectivo'),
(4,1000,'Tarjeta'),
(6,3780,'Transferencia'),
(7,740,'Efectivo');

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
),
(
    'CHECK_OUT',
    'Check-out realizado correctamente'
),
(
    'PAGO',
    'Pago registrado correctamente'
);