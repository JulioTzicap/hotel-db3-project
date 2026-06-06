const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    id_reserva_postgres: {
        type: Number,
        required: true
    },

    id_huesped_postgres: {
        type: Number,
        required: true
    },

    limpieza: Number,

    atencion: Number,

    ubicacion: Number,

    confort: Number,

    calidad_precio: Number,

    comentario: String,

    aspectos_destacables: [String],

    aspectos_mejorables: [String]

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Review",
    reviewSchema
);