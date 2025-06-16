import express from "express";
import { RegisterUser, LoginUser, getLoggedInUser, LogoutUser, getAccessToken } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/me', verifyToken, getLoggedInUser); // Rute terproteksi dengan Access Token
router.post('/logout', LogoutUser);

// Rute untuk refresh token
router.get('/token', getAccessToken); // <<<--- PASTIKAN INI HANYA getAccessToken

export default router;