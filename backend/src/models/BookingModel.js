import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import Flight from "./FlightModel.js"; // Pastikan path benar

const { DataTypes } = Sequelize;

const Booking = db.define('bookings', {
    bookingID: {
        type: DataTypes.STRING, // STRING Primary Key
        primaryKey: true,
        allowNull: false
    },
    userID: {
        type: DataTypes.INTEGER, // Merujuk ke UserModel.userID (INTEGER)
        allowNull: false,
        references: {
            model: User,
            key: 'userID'
        }
    },
    flightID: {
        type: DataTypes.INTEGER, // Merujuk ke FlightModel.flightID (INTEGER)
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