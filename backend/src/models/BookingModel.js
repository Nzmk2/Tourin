import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import Flight from "./FlightModel.js";

const { DataTypes } = Sequelize;

const Booking = db.define('bookings', {
    bookingID: {
        type: DataTypes.STRING, // Keep bookingID as STRING if you want UUIDs for bookings
        primaryKey: true,
        allowNull: false
    },
    userID: { // Changed to INTEGER to match UserModel
        type: DataTypes.INTEGER, // Must match the type in UserModel
        allowNull: false,
        references: {
            model: User,
            key: 'userID'
        }
    },
    flightID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Flight,
            key: 'flightID'
        }
    }
}, {
    freezeTableName: true
});

// Define associations
User.hasMany(Booking, { foreignKey: 'userID' });
Booking.belongsTo(User, { foreignKey: 'userID' });

Flight.hasMany(Booking, { foreignKey: 'flightID' });
Booking.belongsTo(Flight, { foreignKey: 'flightID' });

export default Booking;