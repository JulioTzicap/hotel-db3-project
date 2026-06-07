const { getMongoDB } = require("../config/mongo");

async function satisfaccionTrimestral() {

    const db = getMongoDB();

    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - 3);

    return await db
        .collection("reviews")
        .aggregate([
            {
                $addFields: {
                    fechaConvertida: {
                        $toDate: "$fechaCreacion"
                    }
                }
            },
            {
                $match: {
                    fechaConvertida: {
                        $gte: fechaLimite
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    promedioCalificacion: {
                        $avg: "$calificacion"
                    },
                    totalReviews: {
                        $sum: 1
                    },
                    maxCalificacion: {
                        $max: "$calificacion"
                    },
                    minCalificacion: {
                        $min: "$calificacion"
                    }
                }
            }
        ])
        .toArray();
}
async function aspectosMejorables() {
    const db = getMongoDB();

    return await db.collection("reviews").aggregate([
        {
            $group: {
                _id: null,
                limpieza: { $avg: "$aspectos.limpieza" },
                atencion: { $avg: "$aspectos.atencion" },
                comodidad: { $avg: "$aspectos.comodidad" },
                ubicacion: { $avg: "$aspectos.ubicacion" },
                precioCalidad: { $avg: "$aspectos.precioCalidad" }
            }
        }
    ]).toArray();
}

async function analisisIncidencias() {
    const db = getMongoDB();

    return await db.collection("incidencias").aggregate([
        {
            $facet: {
                porEstado: [
                    { $group: { _id: "$estado", total: { $sum: 1 } } }
                ],
                porPrioridad: [
                    { $group: { _id: "$prioridad", total: { $sum: 1 } } }
                ],
                porTipo: [
                    { $group: { _id: "$tipo", total: { $sum: 1 } } }
                ],
                recientes: [
                    { $sort: { fechaCreacion: -1 } },
                    { $limit: 5 }
                ]
            }
        }
    ]).toArray();
}

async function huespedesFrecuentes() {
    const db = getMongoDB();

    return await db.collection("reviews").aggregate([
        {
            $group: {
                _id: "$huespedId",
                totalReviews: { $sum: 1 },
                promedioCalificacion: { $avg: "$calificacion" }
            }
        },
        { $sort: { totalReviews: -1 } },
        { $limit: 10 }
    ]).toArray();
}

module.exports = {
    satisfaccionTrimestral,
    aspectosMejorables,
    analisisIncidencias,
    huespedesFrecuentes
};