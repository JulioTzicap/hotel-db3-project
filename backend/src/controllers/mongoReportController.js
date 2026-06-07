const mongoReportServices = require("../services/mongoReportServices");

async function obtenerSatisfaccionTrimestral(req, res) {
    try {
        const datos = await mongoReportServices.satisfaccionTrimestral();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function obtenerAspectosMejorables(req, res) {
    try {
        const datos = await mongoReportServices.aspectosMejorables();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function obtenerAnalisisIncidencias(req, res) {
    try {
        const datos = await mongoReportServices.analisisIncidencias();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function obtenerHuespedesFrecuentes(req, res) {
    try {
        const datos = await mongoReportServices.huespedesFrecuentes();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    obtenerSatisfaccionTrimestral,
    obtenerAspectosMejorables,
    obtenerAnalisisIncidencias,
    obtenerHuespedesFrecuentes
};