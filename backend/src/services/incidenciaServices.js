const { getMongoDB } = require(
    "../config/mongo"
);

async function obtenerIncidencias() {

    const db = getMongoDB();

    return await db
        .collection("incidencias")
        .find({})
        .sort({
            fechaCreacion: -1
        })
        .toArray();
}

async function obtenerIncidenciaPorId(id) {

    const db = getMongoDB();

    return await db
        .collection("incidencias")
        .findOne({
            reservaId: Number(id)
        });
}

async function crearIncidencia(incidencia) {

    const db = getMongoDB();

    const resultado =
        await db
            .collection("incidencias")
            .insertOne(incidencia);

    return resultado;
}

async function actualizarIncidencia(
    id,
    incidencia
) {

    const db = getMongoDB();

    return await db
        .collection("incidencias")
        .updateOne(
            {
                reservaId: Number(id)
            },
            {
                $set: incidencia
            }
        );
}

async function eliminarIncidencia(id) {

    const db = getMongoDB();

    return await db
        .collection("incidencias")
        .deleteOne({
            reservaId: Number(id)
        });
}

module.exports = {

    obtenerIncidencias,

    obtenerIncidenciaPorId,
    
    crearIncidencia,

    actualizarIncidencia,

    eliminarIncidencia
};