import {
    Model,
    DataTypes,
    Sequelize,
    Optional,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { hashPassword, comparePassword } from '@util/passwordUtils';
import logging from '@util/logging';

export interface UserAttributes {
    id: number;
    email: string;
    password: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreationAttributes
    extends Optional<UserAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare password: string;
    declare name: string;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    /**
     * Verify password
     */
    public async validPassword(password: string): Promise<boolean> {
        return await comparePassword(password, this.password);
    }

    /**
     * Get user without sensitive data
     */
    public toJSON(): Omit<UserAttributes, 'password'> {
        const values = { ...this.get() } as any;
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
                unique: {
                    name: 'unique_email',
                    msg: 'Email already exists',
                },
                validate: {
                    notEmpty: {
                        msg: 'Email is required',
                    },
                    isEmail: {
                        msg: 'Must be a valid email address',
                    },
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Password is required',
                    },
                    len: {
                        args: [8, 255],
                        msg: 'Password must be at least 8 characters',
                    },
                },
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Name is required',
                    },
                },
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            hooks: {
                beforeCreate: async (user) => {
                    try {
                        user.password = await hashPassword(user.password);
                    } catch (e) {
                        logging.error('Error hashing password:', e);
                        throw e;
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed('password')) {
                        try {
                            user.password = await hashPassword(user.password);
                        } catch (e) {
                            logging.error('Error hashing password:', e);
                            throw e;
                        }
                    }
                },
            },
        }
    );

    return User;
};
