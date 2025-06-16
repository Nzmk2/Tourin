import express from "express";
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserCount // <<<--- TAMBAHKAN INI
} from "../controllers/UserController.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/count', getUserCount); // <<<--- TAMBAHKAN RUTE INI
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;