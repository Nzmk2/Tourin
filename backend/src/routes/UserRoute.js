import express from "express";
import {
    getUsers,
    getUserById,
    // Pastikan createUser diimpor dari UserController.js
    createUser, // <-- TAMBAHKAN INI
    updateUser,
    deleteUser,
    getUserCount,
    getUsersByEmail
} from "../controllers/UserController.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/count', getUserCount);
router.get('/users/:id', getUserById);
router.get('/users/search-by-email', getUsersByEmail);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Rute untuk membuat pengguna baru
router.post('/users', createUser); // <-- TAMBAHKAN RUTE INI

export default router;
