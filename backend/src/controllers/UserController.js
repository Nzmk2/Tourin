import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

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
        // Validation
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ msg: "All required fields must be provided" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(409).json({ msg: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            passportNumber: passportNumber,
            role: role
        });

        res.status(201).json({
            msg: "User created successfully",
            user: {
                userID: newUser.userID,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                msg: "A user with this passport number already exists" 
            });
        }

        res.status(500).json({ 
            msg: "Failed to create user",
            error: error.message 
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                userID: req.params.id
            },
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber', 'role']
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getUsersByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ msg: "Email query parameter is required" });
        }

        const users = await User.findAll({
            where: { email: email },
            attributes: ['userID', 'firstName', 'lastName', 'email', 'role']
        });

        if (users.length === 0) {
            return res.status(404).json({ msg: "No users found with this email" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { firstName, lastName, email, passportNumber, role, password } = req.body;
    
    try {
        // Check if user has permission (admin or own profile)
        if (req.userID != req.params.id && req.role !== 'admin') {
            return res.status(403).json({ 
                msg: "You can only update your own profile unless you're an admin" 
            });
        }

        const user = await User.findOne({
            where: { userID: req.params.id }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        let updateData = { firstName, lastName, email, passportNumber };

        // Only allow role update if user is admin
        if (req.role === 'admin' && role) {
            updateData.role = role;
        }

        // Only hash and update password if it's provided
        if (password) {
            const salt = await bcrypt.genSalt();
            updateData.password = await bcrypt.hash(password, salt);
        }

        await User.update(updateData, {
            where: { userID: req.params.id }
        });

        res.status(200).json({ 
            msg: "User updated successfully",
            updatedFields: Object.keys(updateData)
        });
    } catch (error) {
        console.log(error.message);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                msg: "Email or passport number already in use" 
            });
        }

        res.status(500).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { userID: req.params.id }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        await User.destroy({
            where: { userID: req.params.id }
        });

        res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getUserCount = async (req, res) => {
    try {
        const count = await User.count({
            where: { role: 'user' }
        });
        
        res.status(200).json({ 
            count: count,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};