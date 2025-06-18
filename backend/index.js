import express from "express";
import cors from "cors";
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

const app = express();

// Database connection and synchronization
(async () => {
    try {
        await db.authenticate();
        console.log('Database Connected...');
        
        // Sync all models with database
        // Choose ONE of these sync options:

        // Option 1: This will create tables if they don't exist (safest option)
        await db.sync();
        
        // Option 2: This will update tables if they exist, create if they don't
        // await db.sync({ alter: true });
        
        // Option 3: This will drop existing tables and create new ones (DANGEROUS in production)
        // await db.sync({ force: true });

        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
})();

// Middleware
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', AuthRoutes);
app.use('/api', AirlineRoutes);
app.use('/api', AirportRoutes);
app.use('/api', FlightRoutes);
app.use('/api', BookingRoutes);
app.use('/api', PaymentRoutes);
app.use('/api', DestinationRoutes);
app.use('/api', PackageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));