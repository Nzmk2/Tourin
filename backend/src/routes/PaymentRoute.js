import express from "express";
import {
    getPayments,
    getPaymentById,
    createPayment,
    updatePaymentStatus,
    updatePayment,
    deletePayment
} from "../controllers/PaymentController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/payments', verifyToken, getPayments);
router.get('/payments/:id', verifyToken, getPaymentById);
router.post('/payments', verifyToken, createPayment);
router.patch('/payments/:id/status', verifyToken, updatePaymentStatus);
router.patch('/payments/:id', verifyToken, updatePayment);
router.delete('/payments/:id', verifyToken, deletePayment)

export default router;