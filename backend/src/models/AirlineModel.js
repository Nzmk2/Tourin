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
    logo: {
        type: DataTypes.BLOB('long'),  // Untuk menyimpan gambar dalam bentuk binary
        allowNull: true
    },
    logoType: {
        type: DataTypes.STRING,  // Untuk menyimpan tipe MIME dari gambar
        allowNull: true
    }
}, {
    freezeTableName: true
});

export default Airline;