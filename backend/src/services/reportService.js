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

async function obtenerDisponibilidad(
    inicio,
    fin,
    tipo
) {

    const resultado = await pool.query(
        `
        SELECT *
        FROM obtener_habitaciones_disponibles(
            $1,
            $2,
            $3
        )
        `,
        [inicio, fin, tipo]
    );

    return resultado.rows;
}

async function obtenerSaldoReserva(id) {

    const resultado = await pool.query(
        `
        SELECT obtener_saldo_reserva($1)
        `,
        [id]
    );

    return resultado.rows[0];
}

module.exports = {

    habitacionesDisponibles,

    huespedesActuales,

    ocupacionMensual,

    obtenerSatisfaccionTrimestral,

    obtenerAspectosMejorables,

    obtenerAnalisisIncidencias,

    obtenerPerfilHuespedesFrecuentes,

    obtenerDisponibilidad,

    obtenerSaldoReserva
};