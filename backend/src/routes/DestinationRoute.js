import express from "express";
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

// Public routes
router.get('/destinations', getDestinations);
router.get('/destinations/popular', getPopularDestinations);
router.get('/destinations/:id', getDestinationById);

// Protected routes (admin only)
router.post('/destinations', verifyToken, adminOnly, createDestination);
router.patch('/destinations/:id', verifyToken, adminOnly, updateDestination);
router.delete('/destinations/:id', verifyToken, adminOnly, deleteDestination);

export default router;