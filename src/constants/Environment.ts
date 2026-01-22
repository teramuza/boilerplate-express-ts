/**
 * Environment variable keys
 * Centralized constants for all environment variables
 */

export const ENV = {
    // Application
    NODE_ENV: 'NODE_ENV',
    APP_PORT: 'APP_PORT',
    DEV_MODE: 'DEV_MODE',

    // JWT
    JWT_SECRET_KEY: 'JWT_SECRET_KEY',

    // Database
    DATABASE_URL: 'DATABASE_URL',
    DB_HOST: 'DB_HOST',
    DB_PORT: 'DB_PORT',
    DB_NAME: 'DB_NAME',
    DB_USER: 'DB_USER',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_DIALECT: 'DB_DIALECT',
} as const;

export type EnvironmentKey = keyof typeof ENV;
