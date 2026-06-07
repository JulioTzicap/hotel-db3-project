const pool = require("../config/postgres");

async function obtenerServicios() {

    const resultado = await pool.query(`
        SELECT *
        FROM servicios_extra
        ORDER BY id_servicio
    `);

    return resultado.rows;
}

async function crearServicio(datos) {

    const {
        nombre,
        categoria,
        precio
    } = datos;

    const resultado = await pool.query(
        `
        INSERT INTO servicios_extra
        (
            nombre,
            categoria,
            precio
        )
        VALUES ($1,$2,$3)
        RETURNING *
        `,
        [
            nombre,
            categoria,
            precio
        ]
    );

    return resultado.rows[0];
}

async function actualizarServicio(id, datos) {

    const {
        nombre,
        categoria,
        precio
    } = datos;

    const resultado = await pool.query(
        `
        UPDATE servicios_extra
        SET
            nombre = $1,
            categoria = $2,
            precio = $3
        WHERE id_servicio = $4
        RETURNING *
        `,
        [
            nombre,
            categoria,
            precio,
            id
        ]
    );

    return resultado.rows[0];
}

async function eliminarServicio(id) {

    await pool.query(
        `
        DELETE FROM servicios_extra
        WHERE id_servicio = $1
        `,
        [id]
    );

    return {
        mensaje: "Servicio eliminado"
    };
}

module.exports = {

    obtenerServicios,

    crearServicio,

    actualizarServicio,

    eliminarServicio
};