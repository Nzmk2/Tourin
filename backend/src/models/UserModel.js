import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    userID: {
        type: DataTypes.INTEGER, // INTEGER Primary Key, auto-increment
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passportNumber: {
        type: DataTypes.STRING,
        unique: true
    },
    role: { // NEW FIELD: User Role
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user' // Default role for new registrations
    }
}, {
    freezeTableName: true
});

export default User;