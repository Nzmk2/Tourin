import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Airline = db.define('airlines', {
    airlineID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    logoURL: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

export default Airline;