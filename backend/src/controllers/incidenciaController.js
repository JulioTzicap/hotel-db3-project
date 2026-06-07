const incidenciaServices = require(
    "../services/incidenciaServices"
);

// Se agarra el script para normalizar los ingresos de incidencias
const normalizarIncidencia = require(
    "../../mongo/normalizarIncidencia"
);

async function obtenerIncidencias(req, res) {

    try {

        const datos =
            await incidenciaServices.obtenerIncidencias();

        res.json(datos);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

async function obtenerIncidenciaPorId(req, res) {

    try {

        const datos =
            await incidenciaServices.obtenerIncidenciaPorId(
                req.params.id
            );

        res.json(datos);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

async function crearIncidencia(req, res) {

    try {

        const incidencia = normalizarIncidencia(req.body);

        const resultado =
            await incidenciaServices.crearIncidencia(
                incidencia
            );

        res.status(201).json({
            mensaje: "Incidencia creada",
            id: resultado.insertedId
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}
async function actualizarIncidencia(req, res) {

    try {

        const resultado =
            await incidenciaServices.actualizarIncidencia(
                req.params.id,
                req.body
            );

        res.json({
            mensaje: "Incidencia actualizada",
            modificados: resultado.modifiedCount
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function eliminarIncidencia(req, res) {

    try {

        const resultado =
            await incidenciaServices.eliminarIncidencia(
                req.params.id
            );

        res.json({
            mensaje: "Incidencia eliminada",
            eliminados: resultado.deletedCount
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {

    obtenerIncidencias,

    obtenerIncidenciaPorId,

    crearIncidencia,

    actualizarIncidencia,
    
    eliminarIncidencia
};