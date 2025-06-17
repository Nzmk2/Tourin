import User from "../models/UserModel.js";
import bcrypt from "bcrypt"; // Keep this import

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createUser = async (req, res) => {
    const { firstName, lastName, email, password, passportNumber, role } = req.body;

    try {
        // Basic validation before hashing (optional, but good practice for immediate feedback)
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ msg: "All required fields (first name, last name, email, password, role) must be provided." });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword, // Use the hashed password here
            passportNumber: passportNumber,
            role: role
        });
        res.status(201).json({ msg: "User created successfully!" });
    } catch (error) {
        // --- IMPORTANT: This section is key to debugging ---
        console.error("Error creating user (message):", error.message);
        // Log the full error object to see more details, especially from Sequelize
        console.error("Full error object creating user:", error);

        // Check if it's a Sequelize validation error specifically
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            // Extract more user-friendly messages from Sequelize errors
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ msg: errors.join(', ') || "Validation error." });
        }
        // For other types of errors
        res.status(500).json({ msg: error.message || "Failed to create user due to an internal server error." });
    }
};

export const getUserById = async (req, res) => {
    console.log("Attempting to fetch user with ID:", req.params.id);
    try {
        const response = await User.findOne({
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber', 'role'],
            where: {
                userID: req.params.id
            }
        });
        if (!response) {
            console.log("User not found for ID:", req.params.id);
            return res.status(404).json({ msg: "User not found." });
        }
        console.log("User found:", response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.log("Error fetching user by ID:", error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getUsersByEmail = async (req, res) => {
    try {
        const { email } = req.query; 
        if (!email) {
            return res.status(400).json({ msg: "Email query parameter is required." });
        }

        const users = await User.findAll({
            where: {
                email: email
            },
            attributes: ['userID', 'firstName', 'lastName', 'email'] 
        });

        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ msg: "User with this email not found." });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, passportNumber, role, password } = req.body;
        let updateData = { firstName, lastName, email, passportNumber, role };

        // If a new password is provided, hash it before updating
        if (password) {
            const salt = await bcrypt.genSalt();
            updateData.password = await bcrypt.hash(password, salt);
        }

        const [affectedRows] = await User.update(updateData, { // Use updateData here
            where: {
                userID: req.params.id
            }
        });
        
        if (affectedRows === 0) {
            return res.status(404).json({ msg: "User not found or no changes made." });
        }

        res.status(200).json({ msg: "User updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedRows = await User.destroy({
            where: {
                userID: req.params.id
            }
        });
        if (deletedRows === 0) {
            return res.status(404).json({ msg: "User not found." });
        }
        res.status(200).json({ msg: "User deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getUserCount = async (req, res) => {
    try {
        const count = await User.count({
            where: {
                role: 'user'
            }
        });
        res.status(200).json({ count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};