-- =========================================
-- TABLA HUESPEDES
-- =========================================

CREATE TABLE huespedes (
    id_huesped SERIAL PRIMARY KEY,

    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,

    correo VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(30),

    nacionalidad VARCHAR(80),

    numero_documento VARCHAR(50) UNIQUE,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABLA TIPOS HABITACION
-- =========================================

CREATE TABLE tipos_habitacion (
    id_tipo_habitacion SERIAL PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL UNIQUE,

    descripcion TEXT,

    capacidad INT NOT NULL
    CHECK (capacidad > 0),

    precio_por_noche NUMERIC(10,2) NOT NULL
    CHECK (precio_por_noche > 0),

    comodidades TEXT[],

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABLA HABITACIONES
-- =========================================

CREATE TABLE habitaciones (
    id_habitacion SERIAL PRIMARY KEY,

    numero_habitacion VARCHAR(10) UNIQUE NOT NULL,

    numero_piso INT NOT NULL,

    id_tipo_habitacion INT NOT NULL,

    estado VARCHAR(20)
    NOT NULL
    DEFAULT 'disponible',

    CONSTRAINT fk_habitacion_tipo
    FOREIGN KEY (id_tipo_habitacion)
    REFERENCES tipos_habitacion(id_tipo_habitacion),

    CONSTRAINT chk_estado_habitacion
    CHECK (
        estado IN (
            'disponible',
            'ocupada',
            'mantenimiento',
            'limpieza'
        )
    )
);

-- =========================================
-- TABLA RESERVAS
-- =========================================

CREATE TABLE reservas (
    id_reserva SERIAL PRIMARY KEY,

    id_huesped INT NOT NULL,

    id_habitacion INT NOT NULL,

    fecha_check_in DATE NOT NULL,

    fecha_check_out DATE NOT NULL,

    cantidad_huespedes INT NOT NULL
    CHECK (cantidad_huespedes > 0),

    total_estimado NUMERIC(10,2)
    NOT NULL
    DEFAULT 0,

    estado VARCHAR(20)
    NOT NULL
    DEFAULT 'confirmada',

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reserva_huesped
    FOREIGN KEY (id_huesped)
    REFERENCES huespedes(id_huesped),

    CONSTRAINT fk_reserva_habitacion
    FOREIGN KEY (id_habitacion)
    REFERENCES habitaciones(id_habitacion),

    CONSTRAINT chk_estado_reserva
    CHECK (
        estado IN (
            'pendiente',
            'confirmada',
            'en_curso',
            'completada',
            'cancelada',
            'no_show'
        )
    ),

    CONSTRAINT chk_fechas
    CHECK (
        fecha_check_out > fecha_check_in
    )
);

-- =========================================
-- TABLA SERVICIOS EXTRA
-- =========================================

CREATE TABLE servicios_extra (
    id_servicio SERIAL PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    categoria VARCHAR(50) NOT NULL,

    precio NUMERIC(10,2)
    NOT NULL
    CHECK (precio >= 0),

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABLA CONSUMOS EXTRA
-- =========================================

CREATE TABLE consumos_extra (
    id_consumo SERIAL PRIMARY KEY,

    id_reserva INT NOT NULL,

    id_servicio INT NOT NULL,

    cantidad INT NOT NULL
    CHECK (cantidad > 0),

    subtotal NUMERIC(10,2)
    NOT NULL
    CHECK (subtotal >= 0),

    fecha_consumo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_consumo_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reservas(id_reserva),

    CONSTRAINT fk_consumo_servicio
    FOREIGN KEY (id_servicio)
    REFERENCES servicios_extra(id_servicio)
);

-- =========================================
-- TABLA FACTURAS
-- =========================================

CREATE TABLE facturas (
    id_factura SERIAL PRIMARY KEY,

    id_reserva INT NOT NULL UNIQUE,

    monto_total NUMERIC(10,2)
    NOT NULL
    DEFAULT 0,

    estado VARCHAR(20)
    NOT NULL
    DEFAULT 'pendiente',

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_factura_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reservas(id_reserva),

    CONSTRAINT chk_estado_factura
    CHECK (
        estado IN (
            'pendiente',
            'parcial',
            'pagada'
        )
    )
);

-- =========================================
-- TABLA PAGOS
-- =========================================

CREATE TABLE pagos (
    id_pago SERIAL PRIMARY KEY,

    id_factura INT NOT NULL,

    monto NUMERIC(10,2)
    NOT NULL
    CHECK (monto > 0),

    metodo_pago VARCHAR(50),

    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pago_factura
    FOREIGN KEY (id_factura)
    REFERENCES facturas(id_factura)
);

-- =========================================
-- TABLA AUDITORIA
-- =========================================

CREATE TABLE auditoria_logs (
    id_log SERIAL PRIMARY KEY,

    tipo_operacion VARCHAR(100) NOT NULL,

    descripcion TEXT NOT NULL,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);