import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Airline from "./AirlineModel.js"; // Pastikan path benar
import Airport from "./AirportModel.js"; // Pastikan path benar

const { DataTypes } = Sequelize;

const Flight = db.define('flights', {
    flightID: {
        type: DataTypes.INTEGER, // INTEGER Primary Key, auto-increment
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    departureTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Foreign keys
    airlineID: {
        type: DataTypes.STRING, // ✅ DIUBAH: Sekarang menjadi STRING untuk cocok dengan AirlineModel.airlineID
        allowNull: false,
        references: {
            model: Airline,
            key: 'airlineID'
        }
    },
    departureAirportCode: {
        type: DataTypes.STRING, // Merujuk ke AirportModel.airportCode (STRING)
        allowNull: false,
        references: {
            model: Airport,
            key: 'airportCode'
        }
    },
    destinationAirportCode: {
        type: DataTypes.STRING, // Merujuk ke AirportModel.airportCode (STRING)
        allowNull: false,
        references: {
            model: Airport,
            key: 'airportCode'
        }
    }
}, {
    freezeTableName: true
});

// Define associations
Airline.hasMany(Flight, { foreignKey: 'airlineID' });
Flight.belongsTo(Airline, { foreignKey: 'airlineID' });

Airport.hasMany(Flight, { foreignKey: 'departureAirportCode', as: 'DepartingFlights' });
Flight.belongsTo(Airport, { foreignKey: 'departureAirportCode', as: 'DepartureAirport' });

Airport.hasMany(Flight, { foreignKey: 'destinationAirportCode', as: 'ArrivingFlights' });
Flight.belongsTo(Airport, { foreignKey: 'destinationAirportCode', as: 'DestinationAirport' });

export default Flight;