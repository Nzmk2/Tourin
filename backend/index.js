import express from "express";
import cors from "cors";
import multer from 'multer';
import db from "./src/config/Database.js";
import cookieParser from "cookie-parser";

// Import models to ensure they are registered with Sequelize
import User from "./src/models/UserModel.js";
import Airline from "./src/models/AirlineModel.js";
import Airport from "./src/models/AirportModel.js";
import Flight from "./src/models/FlightModel.js";
import Booking from "./src/models/BookingModel.js";
import Payment from "./src/models/PaymentModel.js";
import Destination from "./src/models/DestinationModel.js";
import Package from "./src/models/PackageModel.js";

// Import routes
import AuthRoutes from "./src/routes/AuthRoute.js";
import AirlineRoutes from "./src/routes/AirlineRoute.js";
import AirportRoutes from "./src/routes/AirportRoute.js";
import FlightRoutes from "./src/routes/FlightRoute.js";
import BookingRoutes from "./src/routes/BookingRoute.js";
import PaymentRoutes from "./src/routes/PaymentRoute.js";
import DestinationRoutes from "./src/routes/DestinationRoute.js";
import PackageRoutes from "./src/routes/PackageRoute.js";
import UserRoutes from "./src/routes/UserRoute.js";

import bookingRoutes from './src/routes/BookingRoute.js';
import flightRoutes from './src/routes/FlightRoute.js';


// Import upload middleware
import { upload } from './src/middleware/uploadMiddleware.js';

const app = express();

// Database connection
(async () => {
    try {
        await db.authenticate();
        console.log('Database Connected...');
        await db.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
})();

// Middleware
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/api/auth', AuthRoutes);
app.use('/api', UserRoutes);
app.use('/api', AirlineRoutes);
app.use('/api', AirportRoutes);
app.use('/api', FlightRoutes);
app.use('/api', BookingRoutes);
app.use('/api', PaymentRoutes);
app.use('/api', DestinationRoutes);
app.use('/api', PackageRoutes);

app.use('/api', bookingRoutes);
app.use('/api', flightRoutes);

// Multer error handling
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File is too large'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next(err);
});

// General error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));