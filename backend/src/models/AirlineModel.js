import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Airline = db.define('airlines', {
    airlineID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    airlineName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactNumber: {
        type: DataTypes.STRING
    },
    operatingRegion: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

export default Airline;