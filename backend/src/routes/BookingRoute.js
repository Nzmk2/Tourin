// Path: backend/routes/BookingRoute.js

import express from "express";
import {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingCount,
    getRecentBookings // <<<--- TAMBAHKAN INI
} from "../controllers/BookingController.js";

const router = express.Router();

router.get('/bookings', getBookings);
router.get('/bookings/count', getBookingCount);
router.get('/bookings/recent', getRecentBookings); // <<<--- TAMBAHKAN RUTE INI
router.get('/bookings/:id', getBookingById);
router.post('/bookings', createBooking);
router.patch('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);

export default router;