import express from "express";
import {
    getPackages,
    getPopularPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
} from "../controllers/PackageController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.get('/packages', getPackages);
router.get('/packages/popular', getPopularPackages);
router.get('/packages/:id', getPackageById);

// Protected routes (admin only)
router.post('/packages', verifyToken, adminOnly, createPackage);
router.patch('/packages/:id', verifyToken, adminOnly, updatePackage);
router.delete('/packages/:id', verifyToken, adminOnly, deletePackage);

export default router;