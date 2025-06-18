import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Airline from "./AirlineModel.js";
import Airport from "./AirportModel.js";

const { DataTypes } = Sequelize;

const Flight = db.define('flights', {
    flightID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    flightNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    airlineID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Airline,
            key: 'airlineID'
        }
    },
    departureAirportCode: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    destinationAirportCode: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    departureTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

Flight.belongsTo(Airline, { foreignKey: 'airlineID' });
Flight.belongsTo(Airport, { as: 'DepartureAirport', foreignKey: 'departureAirportCode', targetKey: 'code' });
Flight.belongsTo(Airport, { as: 'DestinationAirport', foreignKey: 'destinationAirportCode', targetKey: 'code' });

export default Flight;