import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- TEMPATKAN SECRET KEY ANDA DI SINI ---
// Sekali lagi, TIDAK DISARANKAN untuk produksi!
const ACCESS_TOKEN_SECRET = '6f1c342f07c8c672398bcd8c3da92ed307959e90e3a7eb3da0f952fcf6df0f88cac53c7fbaaddc5b4fd82c9aea03483ad3a4ea6d349d77af93e49b4c77da17b0'; // Ganti dengan string acak dan kompleks
const REFRESH_TOKEN_SECRET = '0f64f1c1e2d2e4af11e7094ca0c46434b4e543069329596030b65d41e67f651ac8dee59aa332137a2df2876a4458f32c9707ab80d262e90b0412e4a9ad49b602'; // Ganti dengan string acak dan kompleks
// --- AKHIR DARI TEMPAT SECRET KEY ---

export const RegisterUser = async (req, res) => {
    const { firstName, lastName, email, password, confPassword, passportNumber } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    }

    try {
        const existingUser = await User.findOne({
            where: { email: email }
        });
        if (existingUser) {
            return res.status(409).json({ msg: "Email already registered" });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            passportNumber: passportNumber,
            role: 'user'
        });

        res.status(201).json({ msg: "User registered successfully!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server error during registration: " + error.message });
    }
};

export const LoginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        if (!user) {
            return res.status(404).json({ msg: "Email not found" });
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Wrong password" });
        }

        const userID = user.id; // Asumsikan kolom primary key di UserModel adalah 'id'
        const firstName = user.firstName;
        const lastName = user.lastName; // Pastikan ini diambil dari model User
        const email = user.email;
        const role = user.role;

        const accessToken = jwt.sign(
            { userID, firstName, lastName, email, role }, // Payload untuk Access Token
            ACCESS_TOKEN_SECRET, // Menggunakan variabel lokal
            { expiresIn: '15m' } // Access token singkat (misal: 15 menit)
        );

        const refreshToken = jwt.sign(
            { userID, firstName, lastName, email, role }, // Payload untuk Refresh Token
            REFRESH_TOKEN_SECRET, // Menggunakan variabel lokal
            { expiresIn: '1d' } // Refresh token berumur lebih panjang (misal: 1 hari)
        );

        // Set Refresh Token sebagai cookie HTTP-only
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 hari
        });

        res.status(200).json({ accessToken: accessToken, msg: "Login successful" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server error during login: " + error.message });
    }
};

export const getLoggedInUser = async (req, res) => {
    try {
        // req.userID disetel oleh middleware verifyToken dari Access Token
        const user = await User.findOne({
            attributes: ['id', 'firstName', 'lastName', 'email', 'passportNumber', 'role'],
            where: { id: req.userID } // Menggunakan 'id' sebagai primary key
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Failed to fetch user data: " + error.message });
    }
};

// FUNGSI BARU UNTUK REFRESH TOKEN
export const getAccessToken = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken; // Ambil refresh token dari cookie
        if (!refreshToken) {
            return res.sendStatus(401); // Tidak Sah (Unauthorized)
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => { // Menggunakan variabel lokal
            if (err) {
                console.error("Refresh token verification failed:", err);
                return res.sendStatus(403); // Terlarang (Forbidden)
            }

            // Dapatkan data dari payload refresh token yang didekode
            const userID = decoded.userID;
            const firstName = decoded.firstName;
            const lastName = decoded.lastName;
            const email = decoded.email;
            const role = decoded.role;

            // Buat Access Token baru
            const accessToken = jwt.sign(
                { userID, firstName, lastName, email, role },
                ACCESS_TOKEN_SECRET, // Menggunakan variabel lokal
                { expiresIn: '15m' } // Waktu kadaluarsa Access Token baru
            );

            res.json({ accessToken });
        });

    } catch (error) {
        console.error("Error generating new access token:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const LogoutUser = (req, res) => {
    // Untuk logout, hapus cookie refresh token
    res.clearCookie('refreshToken');
    res.status(200).json({ msg: "Logged out successfully" });
};