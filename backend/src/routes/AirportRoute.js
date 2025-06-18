import express from "express";
import {
    getAirports,
    getAirportById,
    createAirport,
    updateAirport,
    deleteAirport
} from "../controllers/AirportController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Tambahkan slash di depan
router.get('/airports', getAirports);
router.get('/airports/:id', getAirportById);
router.post('/airports', verifyToken, createAirport);
router.patch('/airports/:id', verifyToken, updateAirport);
router.delete('/airports/:id', verifyToken, deleteAirport);

export default router;