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

async function obtenerDisponibilidad(req, res) {

    try {

        const {
            inicio,
            fin,
            tipo
        } = req.query;

        const datos =
            await reportService.obtenerDisponibilidad(
                inicio,
                fin,
                tipo
            );

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function obtenerSaldoReserva(req, res) {

    try {

        const datos =
            await reportService.obtenerSaldoReserva(
                req.params.id
            );

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

    obtenerSatisfaccion,

    obtenerDisponibilidad,

    obtenerSaldoReserva
};