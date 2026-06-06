const pool = require("../config/postgres");

const {
    obtenerSatisfaccionTrimestral,
    obtenerAspectosMejorables,
    obtenerAnalisisIncidencias,
    obtenerPerfilHuespedesFrecuentes
} = require("../utils/pipelines");

async function habitacionesDisponibles() {

    const resultado = await pool.query(
        `
        SELECT *
        FROM vista_habitaciones_disponibles
        `
    );

    return resultado.rows;
}

async function huespedesActuales() {

    const resultado = await pool.query(
        `
        SELECT *
        FROM vista_huespedes_actuales
        `
    );

    return resultado.rows;
}

async function ocupacionMensual() {

    const resultado = await pool.query(
        `
        SELECT *
        FROM vista_ocupacion_mensual
        `
    );

    return resultado.rows;
}

module.exports = {

    habitacionesDisponibles,

    huespedesActuales,

    ocupacionMensual,

    obtenerSatisfaccionTrimestral,

    obtenerAspectosMejorables,

    obtenerAnalisisIncidencias,

    obtenerPerfilHuespedesFrecuentes
};