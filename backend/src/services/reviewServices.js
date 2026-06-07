const { getMongoDB } = require(
    "../config/mongo"
);

async function obtenerReviews() {

    const db = getMongoDB();

    return await db
        .collection("reviews")
        .find({})
        .sort({
            fechaCreacion: -1
        })
        .toArray();
}

async function obtenerReviewPorId(id) {

    const db = getMongoDB();

    return await db
        .collection("reviews")
        .findOne({
            reservaId: Number(id)
        });
}

async function crearReview(review) {

    const db = getMongoDB();

    const resultado =
        await db
            .collection("reviews")
            .insertOne(review);
    
    return resultado;
}


async function actualizarReview(id, review) {

    const db = getMongoDB();

    return await db
        .collection("reviews")
        .updateOne(
            {
                reservaId: Number(id)
            },
            {
                $set: review
            }
        );
}

async function eliminarReview(id) {

    const db = getMongoDB();

    return await db
        .collection("reviews")
        .deleteOne({
            reservaId: Number(id)
        });
}

module.exports = {

    obtenerReviews,

    obtenerReviewPorId,

    crearReview,

    actualizarReview,

    eliminarReview
};