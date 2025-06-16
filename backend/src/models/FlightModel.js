import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Airline from "./AirlineModel.js";
import Airport from "./AirportModel.js";

const { DataTypes } = Sequelize;

const Flight = db.define('flights', {
    flightID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    flightNumber: {
        type: DataTypes.STRING,
        allowNull: false
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
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Airline,
            key: 'airlineID'
        }
    },
    departureAirportCode: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Airport,
            key: 'airportCode'
        }
    },
    destinationAirportCode: {
        type: DataTypes.STRING,
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