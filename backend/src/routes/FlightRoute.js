import express from "express";
import {
    getFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight,
    getFlightCount // <<<--- TAMBAHKAN INI
} from "../controllers/FlightController.js";

const router = express.Router();

router.get('/flights', getFlights);
router.get('/flights/count', getFlightCount); // <<<--- TAMBAHKAN RUTE INI
router.get('/flights/:id', getFlightById);
router.post('/flights', createFlight);
router.patch('/flights/:id', updateFlight);
router.delete('/flights/:id', deleteFlight);

export default router;