import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Destination from "./DestinationModel.js";

const { DataTypes } = Sequelize;

const Package = db.define('packages', {
    packageID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false // Format: "7D/6N"
    },
    maxPax: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB('long'),  // Untuk menyimpan gambar dalam bentuk binary
        allowNull: true
    },
    imageType: {
        type: DataTypes.STRING,  // Untuk menyimpan tipe MIME dari gambar
        allowNull: true
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    destinationID: {
        type: DataTypes.INTEGER,
        references: {
            model: Destination,
            key: 'destinationID'
        }
    }
}, {
    freezeTableName: true
});

Package.belongsTo(Destination, { foreignKey: 'destinationID' });

export default Package;