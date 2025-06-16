import express from "express";
import {
    getFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight
} from "../controllers/FlightController.js"; // Corrected path

const router = express.Router();

router.get('/flights', getFlights);
router.get('/flights/:id', getFlightById);
router.post('/flights', createFlight);
router.patch('/flights/:id', updateFlight);
router.delete('/flights/:id', deleteFlight);

export default router;