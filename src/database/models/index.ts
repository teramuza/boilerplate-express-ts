import { Sequelize } from 'sequelize';
import databaseConfig from '@config/database.config';
import UserModel from './user';
import logging from '@util/logging';

// Initialize Sequelize
// Config is either a connection string (DATABASE_URL) or config object
const sequelize =
    typeof databaseConfig === 'string'
        ? new Sequelize(databaseConfig)
        : new Sequelize(
              databaseConfig.database,
              databaseConfig.username,
              databaseConfig.password,
              databaseConfig
          );

// Initialize models
const models = {
    User: UserModel(sequelize),
    // Add more models here
};

// Setup associations
Object.values(models).forEach((model) => {
    if ('associate' in model && typeof model.associate === 'function') {
        model.associate(models);
    }
});

// Test connection
sequelize
    .authenticate()
    .then(() => {
        logging.info('✅ Database connection established successfully');
    })
    .catch((error) => {
        logging.error('❌ Unable to connect to database:', error);
    });

export { sequelize };
export default models;
