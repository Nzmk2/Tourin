import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";
import Flight from "./FlightModel.js";

const { DataTypes } = Sequelize;

const Booking = db.define('bookings', {
    bookingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userID'
        }
    },
    flightID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Flight,
            key: 'flightID'
        }
    },
    bookingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('booked', 'cancelled'),
        defaultValue: 'booked'
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    freezeTableName: true
});

Booking.belongsTo(User, { foreignKey: 'userID' });
Booking.belongsTo(Flight, { foreignKey: 'flightID' });

export default Booking;