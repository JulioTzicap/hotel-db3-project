const pool = require("../config/postgres");

async function crearReserva(datos) {

    const {
        id_huesped,
        id_habitacion,
        fecha_check_in,
        fecha_check_out,
        cantidad_huespedes
    } = datos;

    await pool.query(

        `
        CALL realizar_reserva(
            $1,
            $2,
            $3,
            $4,
            $5
        )
        `,
        [
            id_huesped,
            id_habitacion,
            fecha_check_in,
            fecha_check_out,
            cantidad_huespedes
        ]
    );

    return {
        mensaje:
            "Reserva realizada correctamente"
    };
}

module.exports = {
    crearReserva
};