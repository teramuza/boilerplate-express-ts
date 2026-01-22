import { config as dotenvConfig } from 'dotenv';
import { Dialect, Options } from 'sequelize';
import { ENV } from '@constant/Environment';

dotenvConfig();

interface DatabaseConfig extends Options {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: Dialect;
}

/**
 * Get database configuration
 * Uses DATABASE_URL in production, individual env vars in development
 */
const getDatabaseConfig = (): DatabaseConfig | string => {
    const isProduction = process.env[ENV.NODE_ENV] === 'production';
    const databaseUrl = process.env[ENV.DATABASE_URL];

    // Production: Use DATABASE_URL if available
    if (isProduction && databaseUrl) {
        return databaseUrl;
    }

    // Development: Use individual env variables
    const config: DatabaseConfig = {
        username: process.env[ENV.DB_USER] || 'postgres',
        password: process.env[ENV.DB_PASSWORD] || 'password',
        database: process.env[ENV.DB_NAME] || 'boilerplate_db',
        host: process.env[ENV.DB_HOST] || 'localhost',
        port: parseInt(process.env[ENV.DB_PORT] || '5432'),
        dialect: (process.env[ENV.DB_DIALECT] as Dialect) || 'postgres',
        logging: process.env[ENV.DEV_MODE] === 'true' ? console.log : false,
    };

    // SSL for production
    if (isProduction) {
        config.dialectOptions = {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        };
        config.logging = false;
    }

    return config;
};

export const databaseConfig = getDatabaseConfig();
export default databaseConfig;
