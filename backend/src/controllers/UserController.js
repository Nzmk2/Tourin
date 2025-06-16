import User from "../models/UserModel.js"; // Pastikan path ke UserModel benar

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            // Menambahkan 'role' ke daftar atribut yang akan diambil
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber', 'role'] // <<< PERBAIKAN DI SINI
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
            attributes: ['userID', 'firstName', 'lastName', 'email', 'passportNumber', 'role'], // Anda mungkin juga ingin menambahkan 'role' di sini
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

// Fungsi untuk menghitung jumlah user
export const getUserCount = async (req, res) => {
    try {
        const count = await User.count(); // Menggunakan Sequelize's .count() method
        res.status(200).json({ count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};
