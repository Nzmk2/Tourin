import express from "express";
import {
    RegisterUser,
    LoginUser,
    LogoutUser,
    refreshToken,
    getLoggedInUser
} from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/token', refreshToken);
router.delete('/logout', LogoutUser);

// Protected routes
router.get('/me', verifyToken, getLoggedInUser);

export default router;