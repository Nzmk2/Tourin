import express from "express";
import db from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser"; // <<<--- TAMBAHKAN INI

// Impor Model untuk sinkronisasi (hanya diperlukan sekali untuk membuat tabel)
import AirlineModel from "./models/AirlineModel.js";
import AirportModel from "./models/AirportModel.js";
import UserModel from "./models/UserModel.js";
import FlightModel from "./models/FlightModel.js";
import BookingModel from "./models/BookingModel.js";
import PaymentModel from "./models/PaymentModel.js";

// Impor Rute
import AirlineRoute from "./routes/AirlineRoute.js";
import AirportRoute from "./routes/AirportRoute.js";
import FlightRoute from "./routes/FlightRoute.js";
import BookingRoute from "./routes/BookingRoute.js";
import PaymentRoute from "./routes/PaymentRoute.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

const app = express();

// Sinkronisasi Database (buat tabel jika belum ada)
(async () => {
    try {
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

// KONFIGURASI CORS YANG BENAR UNTUK MENGIZINKAN KREDENSIAL DARI FRONTEND
app.use(cors({
    origin: 'http://localhost:3000', // Mengizinkan permintaan hanya dari origin frontend Anda
    credentials: true, // PENTING: Mengizinkan pengiriman cookie/kredensial
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Metode HTTP yang diizinkan
    allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
}));

app.use(express.json()); // Untuk mengurai body permintaan JSON
app.use(cookieParser()); // <<<--- TAMBAHKAN INI SEBELUM RUTE ANDA


// Rute
app.use(AirlineRoute);
app.use(AirportRoute);
app.use(FlightRoute);
app.use(BookingRoute);
app.use(PaymentRoute);
app.use(UserRoute);
app.use(AuthRoute); // Rute autentikasi (register, login, /me, /token)

// Mulai server
app.listen(5000, () => console.log("Server up and running on port 5000..."));