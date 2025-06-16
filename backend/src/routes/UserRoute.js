import express from "express";
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/UserController.js";
// Removed createUser as it's now handled by AuthController's RegisterUser

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
// router.post('/users', createUser); // RegisterUser in AuthController handles creation
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;