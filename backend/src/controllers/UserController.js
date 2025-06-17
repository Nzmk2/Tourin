import User from "../models/UserModel.js";

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
    // const salt = await bcrypt.genSalt(); // Untuk hashing
    // const hashedPassword = await bcrypt.hash(password, salt); // Untuk hashing

    try {
        // Logika untuk generate userID jika diperlukan, atau biarkan auto-increment
        // Jika userID Anda STRING seperti AirlineID, Anda perlu logika generate ID di sini
        // Jika INTEGER dan autoIncrement, Sequelize akan menanganinya

        await User.create({
            // userID: generatedUserID, // Jika Anda punya logika generate ID string
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password, // Atau hashedPassword jika Anda menggunakan bcrypt
            passportNumber: passportNumber,
            role: role
        });
        res.status(201).json({ msg: "User created successfully!" });
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ msg: error.message || "Failed to create user." });
    }
};

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber', 'role'],
            where: {
                userID: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

// --- NEW FUNCTION: getUsersByEmail ---
export const getUsersByEmail = async (req, res) => {
    try {
        const { email } = req.query; // Get email from query parameter
        if (!email) {
            return res.status(400).json({ msg: "Email query parameter is required." });
        }

        const users = await User.findAll({
            where: {
                email: email
            },
            attributes: ['userID', 'firstName', 'lastName', 'email'] // Only retrieve necessary user info
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
        await User.update(req.body, {
            where: {
                userID: req.params.id
            }
        });
        res.status(200).json({ msg: "User updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: {
                userID: req.params.id
            }
        });
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