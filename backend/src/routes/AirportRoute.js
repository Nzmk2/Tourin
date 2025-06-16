import express from "express";
import {
    getAirports,
    getAirportById,
    createAirport,
    updateAirport,
    deleteAirport
} from "../controllers/AirportController.js"; // Corrected path AND typo 'Airport'

const router = express.Router();

router.get('/airports', getAirports);
router.get('/airports/:id', getAirportById);
router.post('/airports', createAirport);
router.patch('/airports/:id', updateAirport);
router.delete('/airports/:id', deleteAirport);

export default router;