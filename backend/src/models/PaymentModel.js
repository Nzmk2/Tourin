import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Booking from "./BookingModel.js";

const { DataTypes } = Sequelize;

const Payment = db.define('payments', {
    paymentID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    transactionDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Foreign key
    bookingID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Booking,
            key: 'bookingID'
        }
    }
}, {
    freezeTableName: true
});

// Define association
Booking.hasOne(Payment, { foreignKey: 'bookingID' });
Payment.belongsTo(Booking, { foreignKey: 'bookingID' });

export default Payment;