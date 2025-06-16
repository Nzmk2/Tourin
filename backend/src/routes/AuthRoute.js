import express from "express";
import { RegisterUser, LoginUser, getLoggedInUser, LogoutUser } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/me', verifyToken, getLoggedInUser); // Protected route
router.post('/logout', LogoutUser); // Example logout route

export default router;