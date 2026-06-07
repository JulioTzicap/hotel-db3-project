const express = require("express");

const router = express.Router();

const reservationController = require(
    "../controllers/reservationController"
);

const guestController = require(
    "../controllers/guestController"
);

const checkoutController = require(
    "../controllers/checkoutController"
);

const roomController = require(
    "../controllers/roomController"
);

const reportController = require(
    "../controllers/reportController"
);


const reviewController = require(
    "../controllers/reviewController"
);

const incidenciaController = require(
    "../controllers/incidenciaController"
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

router.get(
    "/reviews",
    reviewController.obtenerReviews
);

router.get(
    "/reviews/:id",
    reviewController.obtenerReviewPorId
);

router.get(
    "/incidencias",
    incidenciaController.obtenerIncidencias
);

router.get(
    "/incidencias/:id",
    incidenciaController.obtenerIncidenciaPorId
);

router.post(
    "/reviews",
    reviewController.crearReview
);

router.post(
    "/incidencias",
    incidenciaController.crearIncidencia
);

router.post(
    "/reviews",
    reviewController.crearReview
);

router.put(
    "/reviews/:id",
    reviewController.actualizarReview
);

router.post(
    "/incidencias",
    incidenciaController.crearIncidencia
);

router.put(
    "/incidencias/:id",
    incidenciaController.actualizarIncidencia
);

router.delete(
    "/reviews/:id",
    reviewController.eliminarReview
);

router.delete(
    "/incidencias/:id",
    incidenciaController.eliminarIncidencia
);
module.exports = router;