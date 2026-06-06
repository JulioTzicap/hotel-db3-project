const pool = require("../config/postgres");

async function obtenerHabitaciones() {

    const resultado = await pool.query(
        `
        SELECT *
        FROM habitaciones
        ORDER BY id_habitacion
        `
    );

    return resultado.rows;
}

async function obtenerHabitacionPorId(id) {

    const resultado = await pool.query(
        `
        SELECT *
        FROM habitaciones
        WHERE id_habitacion = $1
        `,
        [id]
    );

    return resultado.rows[0];
}

async function crearHabitacion(datos) {

    const {
        numero_habitacion,
        numero_piso,
        id_tipo_habitacion,
        estado
    } = datos;

    const resultado = await pool.query(
        `
        INSERT INTO habitaciones
        (
            numero_habitacion,
            numero_piso,
            id_tipo_habitacion,
            estado
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
        [
            numero_habitacion,
            numero_piso,
            id_tipo_habitacion,
            estado
        ]
    );

    return resultado.rows[0];
}

async function actualizarHabitacion(id, datos) {

    const {
        numero_habitacion,
        numero_piso,
        id_tipo_habitacion,
        estado
    } = datos;

    const resultado = await pool.query(
        `
        UPDATE habitaciones
        SET
            numero_habitacion = $1,
            numero_piso = $2,
            id_tipo_habitacion = $3,
            estado = $4
        WHERE id_habitacion = $5
        RETURNING *
        `,
        [
            numero_habitacion,
            numero_piso,
            id_tipo_habitacion,
            estado,
            id
        ]
    );

    return resultado.rows[0];
}

async function eliminarHabitacion(id) {

    await pool.query(
        `
        DELETE FROM habitaciones
        WHERE id_habitacion = $1
        `,
        [id]
    );

    return {
        mensaje: "Habitación eliminada"
    };
}

module.exports = {

    obtenerHabitaciones,

    obtenerHabitacionPorId,

    crearHabitacion,

    actualizarHabitacion,

    eliminarHabitacion
};