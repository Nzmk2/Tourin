import express from "express";
import {
    getPayments,
    getPaymentById,
    createPayment,
    updatePaymentStatus
} from "../controllers/PaymentController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/payments', verifyToken, getPayments);
router.get('/payments/:id', verifyToken, getPaymentById);
router.post('/payments', verifyToken, createPayment);
router.patch('/payments/:id/status', verifyToken, updatePaymentStatus);

export default router;