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

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/count', getUserCount);
router.get('/users/:id', getUserById);
router.get('/users/search-by-email', getUsersByEmail); // Pastikan ini sebelum /users/:id jika ID bisa berupa 'search-by-email'
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users', createUser); 

export default router;