const express = require("express");

const router = express.Router();

const reservationController = require(
    "../controllers/reservationController"
);

const guestController = require(
    "../controllers/guestController"
);

const roomController = require(
    "../controllers/roomController"
);

const reportController = require(
    "../controllers/reportController"
);

router.post(
    "/reservas",
    reservationController.crearReserva
);

router.post(
    "/checkout",
    guestController.checkout
);

router.get(
    "/habitaciones",
    roomController.obtenerHabitaciones
);

router.get(
    "/habitaciones/:id",
    roomController.obtenerHabitacionPorId
);

router.post(
    "/habitaciones",
    roomController.crearHabitacion
);

router.put(
    "/habitaciones/:id",
    roomController.actualizarHabitacion
);

router.delete(
    "/habitaciones/:id",
    roomController.eliminarHabitacion
);

router.get(
    "/huespedes",
    guestController.obtenerHuespedes
);

router.get(
    "/huespedes/:id",
    guestController.obtenerHuespedPorId
);

router.post(
    "/huespedes",
    guestController.crearHuesped
);

router.put(
    "/huespedes/:id",
    guestController.actualizarHuesped
);

router.delete(
    "/huespedes/:id",
    guestController.eliminarHuesped
);

router.get(
    "/habitaciones-disponibles",
    reportController.obtenerHabitacionesDisponibles
);

router.get(
    "/huespedes-actuales",
    reportController.obtenerHuespedesActuales
);

router.get(
    "/ocupacion-mensual",
    reportController.obtenerOcupacionMensual
);

router.get(
    "/satisfaccion",
    reportController.obtenerSatisfaccion
);

module.exports = router;