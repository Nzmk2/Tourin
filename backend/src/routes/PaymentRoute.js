import express from "express";
import {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentCount // <<<--- TAMBAHKAN INI
} from "../controllers/PaymentController.js";

const router = express.Router();

router.get('/payments', getPayments);
router.get('/payments/count', getPaymentCount); // <<<--- TAMBAHKAN RUTE INI
router.get('/payments/:id', getPaymentById);
router.post('/payments', createPayment);
router.patch('/payments/:id', updatePayment);
router.delete('/payments/:id', deletePayment);

export default router;