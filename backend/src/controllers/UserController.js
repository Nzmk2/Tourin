import User from "../models/UserModel.js"; // Changed from Passenger

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber'] // Don't send password
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber'],
            where: {
                userID: req.params.id // Changed from passengerID
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

// create user is now handled by AuthController (RegisterUser)
// export const createUser = async (req, res) => { /* ... */ };

export const updateUser = async (req, res) => {
    try {
        // Be careful when updating passwords here, better to have a separate password change endpoint
        await User.update(req.body, {
            where: {
                userID: req.params.id // Changed from passengerID
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
                userID: req.params.id // Changed from passengerID
            }
        });
        res.status(200).json({ msg: "User deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};