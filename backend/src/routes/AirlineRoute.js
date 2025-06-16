import express from "express";
import {
    getAirlines,
    getAirlineById,
    createAirline,
    updateAirline,
    deleteAirline
} from "../controllers/AirlineController.js"; // Corrected path

const router = express.Router();

router.get('/airlines', getAirlines);
router.get('/airlines/:id', getAirlineById);
router.post('/airlines', createAirline);
router.patch('/airlines/:id', updateAirline);
router.delete('/airlines/:id', deleteAirline);

export default router;