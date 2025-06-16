import express from "express";
import db from "./config/database.js";
import cors from "cors"; // <--- TAMBAHKAN BARIS INI UNTUK MENGIMPOR CORS

// You might use dotenv for environment variables like JWT_SECRET
// import dotenv from "dotenv";
// dotenv.config();

// Import Models for synchronization (only needed once to create tables)
// Order matters for foreign key dependencies
import AirlineModel from "./models/AirlineModel.js";
import AirportModel from "./models/AirportModel.js";
import UserModel from "./models/UserModel.js"; // Changed from PassengerModel
import FlightModel from "./models/FlightModel.js"; // Depends on Airline and Airport
import BookingModel from "./models/BookingModel.js"; // Depends on User and Flight
import PaymentModel from "./models/PaymentModel.js"; // Depends on Booking


// Import Routes
import AirlineRoute from "./routes/AirlineRoute.js";
import AirportRoute from "./routes/AirportRoute.js";
import FlightRoute from "./routes/FlightRoute.js";
import BookingRoute from "./routes/BookingRoute.js";
import PaymentRoute from "./routes/PaymentRoute.js";
import UserRoute from "./routes/UserRoute.js";     // Changed from PassengerRoute
import AuthRoute from "./routes/AuthRoute.js";     // NEW Auth Route

const app = express();

// Database synchronization (create tables if they don't exist)
// Ensure the order respects foreign key constraints
(async () => {
    try {
        await AirlineModel.sync();
        await AirportModel.sync();
        await UserModel.sync(); // Sync User model first as Booking depends on it
        await FlightModel.sync();
        await BookingModel.sync(); // Booking depends on User and Flight
        await PaymentModel.sync(); // Payment depends on Booking
        console.log("Database synchronized!");
    } catch (error) {
        console.error("Error synchronizing database:", error);
    }
})();

// Middleware
app.use(cors()); // Configure CORS as needed for your frontend
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use(AirlineRoute);
app.use(AirportRoute);
app.use(FlightRoute);
app.use(BookingRoute);
app.use(PaymentRoute);
app.use(UserRoute);   // User management routes
app.use(AuthRoute);   // Authentication routes (register, login, /me)

// Start server
app.listen(5000, () => console.log("Server up and running on port 5000..."));