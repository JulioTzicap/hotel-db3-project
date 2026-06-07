const serviceService = require(
    "../services/serviceService"
);

async function obtenerServicios(req, res) {

    try {

        const datos =
            await serviceService.obtenerServicios();

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function crearServicio(req, res) {

    try {

        const datos =
            await serviceService.crearServicio(
                req.body
            );

        res.status(201).json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function actualizarServicio(req, res) {

    try {

        const datos =
            await serviceService.actualizarServicio(
                req.params.id,
                req.body
            );

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function eliminarServicio(req, res) {

    try {

        const datos =
            await serviceService.eliminarServicio(
                req.params.id
            );

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {

    obtenerServicios,

    crearServicio,

    actualizarServicio,

    eliminarServicio
};