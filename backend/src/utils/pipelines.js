const Review = require("../models/mongo/Review");

const Incident = require("../models/mongo/Incident");

const GuestProfile = require("../models/mongo/GuestProfile");

async function obtenerSatisfaccionTrimestral() {

    return await Review.aggregate([

        {
            $group: {

                _id: {

                    trimestre: {

                        $ceil: {

                            $divide: [
                                {
                                    $month: "$createdAt"
                                },
                                3
                            ]
                        }
                    }
                },

                promedio_limpieza: {
                    $avg: "$limpieza"
                },

                promedio_atencion: {
                    $avg: "$atencion"
                },

                promedio_ubicacion: {
                    $avg: "$ubicacion"
                },

                promedio_confort: {
                    $avg: "$confort"
                },

                promedio_calidad_precio: {
                    $avg: "$calidad_precio"
                }
            }
        }
    ]);
}

async function obtenerAspectosMejorables() {

    return await Review.aggregate([

        {
            $unwind: "$aspectos_mejorables"
        },

        {
            $group: {

                _id: "$aspectos_mejorables",

                total: {
                    $sum: 1
                }
            }
        },

        {
            $sort: {
                total: -1
            }
        }
    ]);
}

async function obtenerAnalisisIncidencias() {

    return await Incident.aggregate([

        {
            $group: {

                _id: "$categoria",

                total: {
                    $sum: 1
                },

                resueltas: {

                    $sum: {

                        $cond: [
                            {
                                $eq: [
                                    "$estado",
                                    "resuelta"
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);
}

async function obtenerPerfilHuespedesFrecuentes() {

    return await GuestProfile.aggregate([

        {
            $facet: {

                idiomas: [

                    {
                        $unwind: "$idiomas"
                    },

                    {
                        $group: {

                            _id: "$idiomas",

                            total: {
                                $sum: 1
                            }
                        }
                    }
                ],

                alergias: [

                    {
                        $unwind: "$alergias"
                    },

                    {
                        $group: {

                            _id: "$alergias",

                            total: {
                                $sum: 1
                            }
                        }
                    }
                ]
            }
        }
    ]);
}

module.exports = {

    obtenerSatisfaccionTrimestral,

    obtenerAspectosMejorables,

    obtenerAnalisisIncidencias,

    obtenerPerfilHuespedesFrecuentes
};