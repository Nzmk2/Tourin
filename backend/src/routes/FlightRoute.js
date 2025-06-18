import express from "express";
import {
    getFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight
} from "../controllers/FlightController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/flights', getFlights);
router.get('/flights/:id', getFlightById);
router.post('/flights', verifyToken, createFlight);
router.patch('/flights/:id', verifyToken, updateFlight);
router.delete('/flights/:id', verifyToken, deleteFlight);

export default router;