const reportService = require(
    "../services/reportService"
);

async function obtenerHabitacionesDisponibles(req, res) {

    try {

        const datos =
            await reportService.habitacionesDisponibles();

        res.json(datos);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

async function obtenerHuespedesActuales(req, res) {

    try {

        const datos =
            await reportService.huespedesActuales();

        res.json(datos);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

async function obtenerOcupacionMensual(req, res) {

    try {

        const datos =
            await reportService.ocupacionMensual();

        res.json(datos);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

async function obtenerSatisfaccion(req, res) {

    try {

        const datos =
            await reportService.obtenerSatisfaccionTrimestral();

        res.json(datos);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

module.exports = {

    obtenerHabitacionesDisponibles,

    obtenerHuespedesActuales,

    obtenerOcupacionMensual,

    obtenerSatisfaccion
};