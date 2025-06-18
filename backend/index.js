import express from "express";
import db from "./src/config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Impor Model untuk sinkronisasi (hanya diperlukan sekali untuk membuat tabel)
import AirlineModel from "./src/models/AirlineModel.js";
import AirportModel from "./src/models/AirportModel.js";
import UserModel from "./src/models/UserModel.js";
import FlightModel from "./src/models/FlightModel.js";
import BookingModel from "./src/models/BookingModel.js";
import PaymentModel from "./src/models/PaymentModel.js";

// Impor Rute
import AirlineRoute from "./src/routes/AirlineRoute.js";
import AirportRoute from "./src/routes/AirportRoute.js";
import FlightRoute from "./src/routes/FlightRoute.js";
import BookingRoute from "./src/routes/BookingRoute.js";
import PaymentRoute from "./src/routes/PaymentRoute.js";
import UserRoute from "./src/routes/UserRoute.js";
import AuthRoute from "./src/routes/AuthRoute.js";

const app = express();

// Sinkronisasi Database (buat tabel jika belum ada)
(async () => {
    try {
        await db.authenticate(); // Pastikan koneksi DB berhasil
        console.log('Database connected...');
        await AirlineModel.sync();
        await AirportModel.sync();
        await UserModel.sync();
        await FlightModel.sync();
        await BookingModel.sync();
        await PaymentModel.sync();
        console.log("Database synchronized!");
    } catch (error) {
        console.error("Error synchronizing database:", error);
    }
})();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Mengizinkan permintaan hanya dari origin frontend Anda
    credentials: true, // PENTING: Mengizinkan pengiriman cookie/kredensial
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Metode HTTP yang diizinkan
    allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
}));

app.use(express.json()); // Untuk mengurai body permintaan JSON
app.use(cookieParser()); 

// Rute
app.use(AirlineRoute);
app.use(AirportRoute);
app.use(FlightRoute);
app.use(BookingRoute);
app.use(PaymentRoute);
app.use(UserRoute);
app.use(AuthRoute); 

// Mulai server
app.listen(5000, () => console.log("Server up and running on port 5000..."));