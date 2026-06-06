-- =========================================
-- INDICES RESERVAS
-- =========================================

CREATE INDEX idx_reservas_habitacion
ON reservas(id_habitacion);

CREATE INDEX idx_reservas_fechas
ON reservas(fecha_check_in, fecha_check_out);

CREATE INDEX idx_reservas_estado
ON reservas(estado);

-- =========================================
-- INDICES FACTURAS
-- =========================================

CREATE INDEX idx_facturas_estado
ON facturas(estado);

-- =========================================
-- INDICES PAGOS
-- =========================================

CREATE INDEX idx_pagos_factura
ON pagos(id_factura);

-- =========================================
-- INDICES CONSUMOS
-- =========================================

CREATE INDEX idx_consumos_reserva
ON consumos_extra(id_reserva);

-- =========================================
-- INDICES HABITACIONES
-- =========================================

CREATE INDEX idx_habitaciones_estado
ON habitaciones(estado);