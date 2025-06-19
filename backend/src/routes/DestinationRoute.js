import express from "express";
import multer from 'multer';
import {
    getDestinations,
    getPopularDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
} from "../controllers/DestinationController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.get('/destinations', getDestinations);
router.get('/destinations/popular', getPopularDestinations);
router.get('/destinations/:id', getDestinationById);
router.post('/destinations', verifyToken, adminOnly, upload.single('image'), createDestination);
router.patch('/destinations/:id', verifyToken, adminOnly, upload.single('image'), updateDestination);
router.delete('/destinations/:id', verifyToken, adminOnly, deleteDestination);

export default router;