# Database Guide

This boilerplate uses **Sequelize ORM** with **PostgreSQL**. You can easily adapt it for MySQL, SQLite, or other databases.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Setup](#quick-setup)
- [Configuration](#configuration)
- [Migrations](#migrations)
- [Models](#models)
- [Usage in Controllers](#usage-in-controllers)
- [CLI Commands](#cli-commands)

---

## Prerequisites

### Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### Create Database

```bash
# Access PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE boilerplate_db;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE boilerplate_db TO postgres;
\q
```

---

## Quick Setup

### 1. Configure Environment

Edit `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boilerplate_db
DB_USER=postgres
DB_PASSWORD=password
DB_DIALECT=postgres
```

### 2. Run Migrations

```bash
# Create database (if not exists)
npm run db:create

# Run migrations
npm run db:migrate
```

### 3. Test Connection

Start the server:
```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully
🚀 Server is running on port 3000
```

---

## Configuration

### Environment Variables

All environment variable keys are centralized in `src/constants/Environment.ts`:

```typescript
export const ENV = {
    // Database
    DATABASE_URL: 'DATABASE_URL',
    DB_HOST: 'DB_HOST',
    DB_PORT: 'DB_PORT',
    DB_NAME: 'DB_NAME',
    DB_USER: 'DB_USER',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_DIALECT: 'DB_DIALECT',
} as const;
```

This approach provides:
- **Type safety**: Autocomplete and error checking
- **Maintainability**: Centralized constant references
- **Clean code**: `process.env[ENV.DB_NAME]` instead of `process.env['DB_NAME']`

### Database Config File

`src/config/database.config.ts`:

```typescript
import { ENV } from '@constant/Environment';

const config: DatabaseConfig = {
    username: process.env[ENV.DB_USER] || 'postgres',
    password: process.env[ENV.DB_PASSWORD] || 'password',
    database: process.env[ENV.DB_NAME] || 'boilerplate_db',
    host: process.env[ENV.DB_HOST] || 'localhost',
    port: parseInt(process.env[ENV.DB_PORT] || '5432'),
    dialect: (process.env[ENV.DB_DIALECT] as Dialect) || 'postgres',
    logging: process.env[ENV.DEV_MODE] === 'true' ? console.log : false,
};
```

### Production Configuration

For production, use `DATABASE_URL` (single connection string):

```env
# Production
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
```

For development, use individual variables:

```env
# Development
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boilerplate_db
DB_USER=postgres
DB_PASSWORD=password
DB_DIALECT=postgres
```

The config automatically uses `DATABASE_URL` when `NODE_ENV=production`, otherwise it uses individual variables.

---

## Migrations

### Create Migration

```bash
npm run migration:generate -- create-products
```

This creates a file in `src/database/migrations/`.

### Migration Example

```javascript
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('products');
    },
};
```

### Run Migrations

```bash
# Run all pending migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all
```

---

## Models

### Example Model Structure

`src/database/models/user.ts`:

```typescript
import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
    declare id: number;
    declare email: string;
    declare password: string;
    declare name: string;
    
    // Custom methods
    public async validPassword(password: string): Promise<boolean> {
        return await comparePassword(password, this.password);
    }
    
    // Remove sensitive data
    public toJSON() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    }
}

export default (sequelize: Sequelize): typeof User => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: { msg: 'Must be a valid email' },
                },
            },
            // ... other fields
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            hooks: {
                beforeCreate: async (user) => {
                    user.password = await hashPassword(user.password);
                },
            },
        }
    );
    
    return User;
};
```

### Register Model

Add to `src/database/models/index.ts`:

```typescript
import ProductModel from './product';

const models = {
    User: UserModel(sequelize),
    Product: ProductModel(sequelize),  // Add here
};
```

### Model Associations

```typescript
export class User extends Model {
    static associate(models: any) {
        User.hasMany(models.Product, { foreignKey: 'userId' });
    }
}

export class Product extends Model {
    static associate(models: any) {
        Product.belongsTo(models.User, { foreignKey: 'userId' });
    }
}
```

---

## Usage in Controllers

### Import Models

```typescript
import db from '@model';
```

### Create

```typescript
const user = await db.User.create({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
});
```

### Find

```typescript
// Find by primary key
const user = await db.User.findByPk(1);

// Find one
const user = await db.User.findOne({
    where: { email: 'user@example.com' },
});

// Find all
const users = await db.User.findAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']],
    limit: 10,
});

// Find with pagination
const { count, rows } = await db.User.findAndCountAll({
    limit: 10,
    offset: 0,
});
```

### Update

```typescript
// Update instance
await user.update({ name: 'Jane Doe' });

// Bulk update
await db.User.update(
    { isActive: false },
    { where: { id: [1, 2, 3] } }
);
```

### Delete

```typescript
// Delete instance
await user.destroy();

// Bulk delete
await db.User.destroy({
    where: { isActive: false },
});
```

### Associations

```typescript
// With associations
const user = await db.User.findOne({
    where: { id: 1 },
    include: [
        {
            model: db.Product,
            as: 'products',
        },
    ],
});
```

---

## CLI Commands

### Database Management

```bash
# Create database
npm run db:create

# Drop database
npm run db:drop
```

### Migrations

```bash
# Run all migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all

# Generate new migration
npm run migration:generate -- migration-name
```

### Seeds

```bash
# Run all seeders
npm run db:seed

# Undo all seeders
npm run db:seed:undo

# Generate new seeder
npm run seed:generate -- seeder-name
```

---

## Using Other Databases

### MySQL

**1. Install driver:**
```bash
npm install mysql2
```

**2. Update `.env`:**
```env
DB_DIALECT=mysql
DB_PORT=3306
```

### SQLite (Development)

**1. Update `.env`:**
```env
DB_DIALECT=sqlite
# No host/port needed
```

**2. Update `database.config.ts`:**
```typescript
if (process.env.DB_DIALECT === 'sqlite') {
    config.storage = './database.sqlite';
}
```

---

## Best Practices

### 1. Migrations

- ✅ Always create migrations for schema changes
- ✅ Test migrations before deploying
- ✅ Never edit committed migrations
- ✅ Use timestamps in migration names

### 2. Models

- ✅ Define validations in models
- ✅ Use hooks for password hashing
- ✅ Remove sensitive data in `toJSON()`
- ✅ Add indexes for frequently queried fields

### 3. Queries

- ✅ Use `findByPk()` for primary key lookups
- ✅ Add `attributes` to select specific fields
- ✅ Use pagination for large datasets
- ✅ Add proper indexes for performance

### 4. Security

- ✅ Hash passwords before storing
- ✅ Use parameterized queries (Sequelize does this)
- ✅ Validate input before database operations
- ✅ Never expose database credentials

---

## Troubleshooting

### Connection Refused

**Problem:** `ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
brew services start postgresql@16  # macOS
sudo systemctl start postgresql     # Linux
```

### Authentication Failed

**Problem:** `password authentication failed`

**Solution:**
- Check `.env` credentials
- Reset PostgreSQL password
- Check `pg_hba.conf` for auth method

### Migrations Out of Sync

**Problem:** Database schema doesn't match models

**Solution:**
```bash
# Reset database (development only!)
npm run db:migrate:undo:all
npm run db:migrate
```

---

## Production Deployment

### 1. Use Environment Variable

```env
DATABASE_URL=postgresql://user:password@host:5432/database?ssl=true
```

### 2. SSL Configuration

The config automatically enables SSL in production:

```typescript
if (process.env.NODE_ENV === 'production') {
    config.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}
```

### 3. Run Migrations

```bash
# On server
npm run db:migrate
```

---

## Example: Complete CRUD

See `src/components/users/User.controller.ts` for a complete example with:
- ✅ Create (register)
- ✅ Read (get all, get by ID)
- ✅ Update
- ✅ Delete
- ✅ Authentication (login)
- ✅ Password hashing
- ✅ Validation
- ✅ Error handling

---

**Need help?** Check the [Sequelize documentation](https://sequelize.org/docs/v6/)
