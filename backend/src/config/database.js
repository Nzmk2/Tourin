import { Sequelize } from "sequelize";

const db = new Sequelize('tourin', 'root', 'oop', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;