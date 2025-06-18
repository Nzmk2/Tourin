import express from "express";
import multer from 'multer';
import {
    getAirlines,
    getAirlineById,
    createAirline,
    updateAirline,
    deleteAirline
} from "../controllers/AirlineController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.get('/airlines', getAirlines);
router.get('/airlines/:id', getAirlineById);
router.post('/airlines', verifyToken, upload.single('logo'), createAirline);
router.patch('/airlines/:id', verifyToken, upload.single('logo'), updateAirline);
router.delete('/airlines/:id', verifyToken, deleteAirline);

export default router;