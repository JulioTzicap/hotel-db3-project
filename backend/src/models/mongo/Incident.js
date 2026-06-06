const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({

    id_reserva_postgres: {
        type: Number,
        required: true
    },

    categoria: {
        type: String,
        required: true
    },

    descripcion: {
        type: String,
        required: true
    },

    estado: {
        type: String,
        default: "pendiente"
    },

    acciones: [
        {
            responsable: String,

            descripcion: String,

            fecha: Date
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Incident",
    incidentSchema
);