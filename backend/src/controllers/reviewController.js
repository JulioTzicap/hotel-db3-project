const reviewServices = require(
    "../services/reviewServices"
);

async function obtenerReviews(req, res) {

    try {

        const datos =
            await reviewServices.obtenerReviews();

        res.json(datos);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

async function obtenerReviewPorId(req, res) {

    try {

        const datos =
            await reviewServices.obtenerReviewPorId(
                req.params.id
            );

        res.json(datos);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

async function crearReview(req, res) {

    try {

        const resultado =
            await reviewServices.crearReview(
                req.body
            );

        res.status(201).json({
            mensaje: "Review creada",
            id: resultado.insertedId
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function actualizarReview(req, res) {

    try {

        const resultado =
            await reviewServices.actualizarReview(
                req.params.id,
                req.body
            );

        res.json({
            mensaje: "Review actualizada",
            modificados: resultado.modifiedCount
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function eliminarReview(req, res) {

    try {

        const resultado =
            await reviewServices.eliminarReview(
                req.params.id
            );

        res.json({
            mensaje: "Review eliminada",
            eliminados: resultado.deletedCount
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {

    obtenerReviews,

    obtenerReviewPorId,

    crearReview,

    actualizarReview,

    eliminarReview
};