const reservationService = require(
    "../services/reservationService"
);

async function crearReserva(req, res) {

    try {

        const resultado =
            await reservationService.crearReserva(
                req.body
            );

        res.status(201).json(resultado);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

module.exports = {
    crearReserva
};