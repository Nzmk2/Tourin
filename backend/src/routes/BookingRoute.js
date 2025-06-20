import express from "express";
import {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getUserBookings,
    getBookingsCount,
    getRecentBookings
} from "../controllers/BookingController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Add leading slash to all routes
router.get('/bookings/count', verifyToken, getBookingsCount);
router.get('/bookings/recent', verifyToken, getRecentBookings);

router.get('/bookings', verifyToken, getBookings);
router.get('/bookings/:id', verifyToken, getBookingById);
router.post('/bookings', verifyToken, createBooking);
router.patch('/bookings/:id', verifyToken, updateBooking);
router.delete('/bookings/:id', verifyToken, deleteBooking);
router.get('/user/bookings', verifyToken, getUserBookings);

export default router;