const guestService = require(
    "../services/guestService"
);

const checkoutService = require(
    "../services/checkoutService"
);

async function obtenerHuespedes(req, res) {

    try {

        const datos =
            await guestService.obtenerHuespedes();

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function obtenerHuespedPorId(req, res) {

    try {

        const datos =
            await guestService.obtenerHuespedPorId(
                req.params.id
            );

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function crearHuesped(req, res) {

    try {

        const datos =
            await guestService.crearHuesped(
                req.body
            );

        res.status(201).json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function actualizarHuesped(req, res) {

    try {

        const datos =
            await guestService.actualizarHuesped(
                req.params.id,
                req.body
            );

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function eliminarHuesped(req, res) {

    try {

        const datos =
            await guestService.eliminarHuesped(
                req.params.id
            );

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function checkout(req, res) {

    try {

        const resultado =
            await checkoutService.realizarCheckout(
                req.body
            );

        res.json(resultado);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {

    obtenerHuespedes,

    obtenerHuespedPorId,

    crearHuesped,

    actualizarHuesped,

    eliminarHuesped,

    checkout
};