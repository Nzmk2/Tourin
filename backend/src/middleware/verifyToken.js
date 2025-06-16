import jwt from "jsonwebtoken";

// --- TEMPATKAN SECRET KEY ANDA DI SINI ---
// Sekali lagi, TIDAK DISARANKAN untuk produksi!
const ACCESS_TOKEN_SECRET = '6f1c342f07c8c672398bcd8c3da92ed307959e90e3a7eb3da0f952fcf6df0f88cac53c7fbaaddc5b4fd82c9aea03483ad3a4ea6d349d77af93e49b4c77da17b0'; // Harus sama dengan di AuthController.js
// --- AKHIR DARI TEMPAT SECRET KEY ---

// Middleware untuk memverifikasi JWT token
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ msg: "No token, authorization denied" }); // Tidak ada token yang disediakan
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => { // Menggunakan variabel lokal
        if (err) {
            return res.status(403).json({ msg: "Token is not valid or expired" });
        }
        req.userID = decoded.userID; // Lampirkan ID pengguna dari token ke objek request
        req.email = decoded.email;   // Lampirkan email dari token ke objek request
        req.role = decoded.role;     // Lampirkan peran dari token ke objek request (penting untuk ProtectedRoute)
        next(); // Lanjutkan ke middleware/handler rute berikutnya
    });
};