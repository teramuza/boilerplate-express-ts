// This file is required by sequelize-cli
// It must be in CommonJS format
require('dotenv').config();

module.exports = {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'boilerplate_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.DEV_MODE === 'true',
};
