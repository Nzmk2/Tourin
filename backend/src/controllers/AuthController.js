import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = '6f1c342f07c8c672398bcd8c3da92ed307959e90e3a7eb3da0f952fcf6df0f88cac53c7fbaaddc5b4fd82c9aea03483ad3a4ea6d349d77af93e49b4c77da17b0';
const REFRESH_TOKEN_SECRET = '0f64f1c1e2d2e4af11e7094ca0c46434b4e543069329596030b65d41e67f651ac8dee59aa332137a2df2876a4458f32c9707ab80d262e90b0412e4a9ad49b602';

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

        const userID = user.userID;
        const firstName = user.firstName;
        const lastName = user.lastName;
        const email = user.email;
        const role = user.role;

        const accessToken = jwt.sign(
            { userID, firstName, lastName, email, role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userID, firstName, lastName, email, role },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        await User.update({ refresh_token: refreshToken }, {
            where: {
                userID: userID
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken: accessToken, msg: "Login successful" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server error during login: " + error.message });
    }
};

export const LogoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(204);
    }

    const user = await User.findOne({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!user) {
        return res.sendStatus(204);
    }

    await User.update({ refresh_token: null }, {
        where: {
            userID: user.userID
        }
    });

    res.clearCookie('refreshToken');
    return res.status(200).json({ msg: "Logged out successfully" });
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(401);
        }

        const user = await User.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) {
            return res.sendStatus(403);
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);

            const userID = user.userID;
            const firstName = user.firstName;
            const lastName = user.lastName;
            const email = user.email;
            const role = user.role;

            const accessToken = jwt.sign(
                { userID, firstName, lastName, email, role },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const getLoggedInUser = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber', 'role'],
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