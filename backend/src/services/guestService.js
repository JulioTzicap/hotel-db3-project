const pool = require("../config/postgres");

async function obtenerHuespedes() {

    const resultado = await pool.query(
        `
        SELECT *
        FROM huespedes
        ORDER BY id_huesped
        `
    );

    return resultado.rows;
}

async function obtenerHuespedPorId(id) {

    const resultado = await pool.query(
        `
        SELECT *
        FROM huespedes
        WHERE id_huesped = $1
        `,
        [id]
    );

    return resultado.rows[0];
}

async function crearHuesped(datos) {

    const {
        nombres,
        apellidos,
        correo,
        telefono,
        nacionalidad,
        numero_documento
    } = datos;

    const resultado = await pool.query(
        `
        INSERT INTO huespedes
        (
            nombres,
            apellidos,
            correo,
            telefono,
            nacionalidad,
            numero_documento
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
        [
            nombres,
            apellidos,
            correo,
            telefono,
            nacionalidad,
            numero_documento
        ]
    );

    return resultado.rows[0];
}

async function actualizarHuesped(id, datos) {

    const {
        nombres,
        apellidos,
        correo,
        telefono,
        nacionalidad,
        numero_documento
    } = datos;

    const resultado = await pool.query(
        `
        UPDATE huespedes
        SET
            nombres = $1,
            apellidos = $2,
            correo = $3,
            telefono = $4,
            nacionalidad = $5,
            numero_documento = $6
        WHERE id_huesped = $7
        RETURNING *
        `,
        [
            nombres,
            apellidos,
            correo,
            telefono,
            nacionalidad,
            numero_documento,
            id
        ]
    );

    return resultado.rows[0];
}

async function eliminarHuesped(id) {

    await pool.query(
        `
        DELETE FROM huespedes
        WHERE id_huesped = $1
        `,
        [id]
    );

    return {
        mensaje: "Huésped eliminado"
    };
}

module.exports = {

    obtenerHuespedes,

    obtenerHuespedPorId,

    crearHuesped,

    actualizarHuesped,

    eliminarHuesped
};