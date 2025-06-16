import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
            role: 'user' // Explicitly assign 'user' role for new registrations
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

        const userID = user.userID;
        const firstName = user.firstName;
        const email = user.email;
        const role = user.role; // Include role in the JWT payload

        const accessToken = jwt.sign(
            { userID, firstName, email, role }, // Added role to payload
            process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret',
            { expiresIn: '15m' }
        );

        res.status(200).json({ accessToken: accessToken, msg: "Login successful" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server error during login: " + error.message });
    }
};

export const getLoggedInUser = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber', 'role'], // Include role
            where: { userID: req.userID }
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

export const LogoutUser = (req, res) => {
    res.status(200).json({ msg: "Logged out successfully (client should clear token)" });
};