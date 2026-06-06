const mongoose = require("mongoose");

const guestProfileSchema = new mongoose.Schema({

    id_huesped_postgres: {
        type: Number,
        required: true
    },

    preferencias: {

        tipo_almohada: String,

        temperatura_preferida: String,

        vista_preferida: String
    },

    alergias: [String],

    restricciones_alimentarias: [String],

    idiomas: [String],

    peticiones_especiales: [String],

    programa_lealtad: {

        nivel: String,

        puntos: Number
    },

    historial_preferencias: [
        {
            fecha: Date,

            comentario: String
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "GuestProfile",
    guestProfileSchema
);

