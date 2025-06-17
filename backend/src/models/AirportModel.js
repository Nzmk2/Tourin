import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Airport = db.define('airports', {
    airportCode: {
        type: DataTypes.STRING, // Sudah STRING, Primary Key
        primaryKey: true,
        allowNull: false
    },
    airportName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facilities: {
        type: DataTypes.TEXT
    },
    location: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

export default Airport;