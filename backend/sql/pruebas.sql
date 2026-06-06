SELECT * FROM vista_habitaciones_disponibles;

SELECT * FROM vista_huespedes_actuales;

SELECT * FROM vista_ocupacion_mensual;

SELECT * FROM vista_top_huespedes;

SELECT obtener_saldo_reserva(4);

-- después de ejecutar el procedimiento se puede ejecutar esta prueba
CALL realizar_reserva(
    1,
    2,
    '2026-07-01',
    '2026-07-05',
    2
);

SELECT * FROM reservas
ORDER BY id_reserva DESC;

-- probar error de solape
CALL realizar_reserva(
    2,
    2,
    '2026-07-03',
    '2026-07-06',
    2
);

-- probar chekout, la reserva 4 debe estar "en curso"
CALL realizar_checkout(
    4,
    2225,
    'Tarjeta'
);

-- despues de ejecutar eso debe estar "completada"
SELECT * FROM reservas
WHERE id_reserva = 4;

