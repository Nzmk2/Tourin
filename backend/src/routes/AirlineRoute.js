import express from "express";
import {
    getAirlines,
    getAirlineById,
    createAirline,
    updateAirline,
    deleteAirline
} from "../controllers/AirlineController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/airlines', getAirlines);
router.get('/airlines/:id', getAirlineById);
router.post('/airlines', verifyToken, createAirline);
router.patch('/airlines/:id', verifyToken, updateAirline);
router.delete('/airlines/:id', verifyToken, deleteAirline);

export default router;