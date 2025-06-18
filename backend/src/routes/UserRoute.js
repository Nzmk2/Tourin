import express from "express";
import { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
    getUserCount,
    getUsersByEmail
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.post('/users', createUser);  // Allow user creation without authentication

// Protected routes
router.get('/users', verifyToken, adminOnly, getUsers);
router.get('/users/count', verifyToken, adminOnly, getUserCount);
router.get('/users/search', verifyToken, adminOnly, getUsersByEmail);
router.get('/users/:id', verifyToken, getUserById);
router.patch('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, adminOnly, deleteUser);

export default router;