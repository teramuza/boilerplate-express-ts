import { Request, Response } from 'express';
import BaseController from '@lib/base/BaseController';
import { ErrorResponse } from '@types';
import { validateObject } from '@util/validationUtils';
import db from '@model';
import { generateToken } from '@util/tokenUtils';
import ErrorCodes from '@constant/ErrorCodes';

class UserController extends BaseController {
    /**
     * Register new user
     * @route POST /api/v1/users/register
     */
    public async register(req: Request, res: Response) {
        try {
            // Validate input
            const validation = validateObject(req.body, {
                email: { required: true, type: 'email' },
                password: { required: true, type: 'password' },
                name: { required: true, type: 'string', minLength: 2 },
            });

            if (!validation.isValid) {
                this.badRequestResponse(
                    res,
                    'Validation failed',
                    ErrorCodes.DEFAULT,
                    validation.errors
                );
                return;
            }

            const { email, password, name } = req.body;

            // Create user
            const user = await db.User.create({
                email,
                password,
                name,
            });

            // Generate token
            const token = generateToken({ sub: user.id.toString() });

            this.successHandler(res, 'User registered successfully', {
                user: user.toJSON(),
                token,
            });
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                this.badRequestResponse(
                    res,
                    'Email already exists',
                    ErrorCodes.DEFAULT
                );
            } else if (error.name === 'SequelizeValidationError') {
                this.badRequestResponse(
                    res,
                    error.errors[0]?.message || 'Validation error',
                    ErrorCodes.DEFAULT
                );
            } else {
                this.handleError(res, error as ErrorResponse);
            }
        }
    }

    /**
     * Login user
     * @route POST /api/v1/users/login
     */
    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                this.badRequestResponse(
                    res,
                    'Email and password are required',
                    ErrorCodes.DEFAULT
                );
                return;
            }

            // Find user
            const user = await db.User.findOne({ where: { email } });

            if (!user) {
                this.unauthorizedResponse(res, {
                    code: ErrorCodes.AUTH_UNAUTHORIZED_USER_LOGIN,
                    message: 'Invalid email or password',
                });
                return;
            }

            // Verify password
            const isValidPassword = await user.validPassword(password);

            if (!isValidPassword) {
                this.unauthorizedResponse(res, {
                    code: ErrorCodes.AUTH_UNAUTHORIZED_USER_LOGIN,
                    message: 'Invalid email or password',
                });
                return;
            }

            // Generate token
            const token = generateToken({ sub: user.id.toString() });

            this.successHandler(res, 'Login successful', {
                user: user.toJSON(),
                token,
            });
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }

    /**
     * Get all users
     * @route GET /api/v1/users
     */
    public async getAll(req: Request, res: Response) {
        try {
            const page = Number(this.getQueryValue(req, 'page')) || 1;
            const limit = Number(this.getQueryValue(req, 'limit')) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await db.User.findAndCountAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });

            this.successHandler(res, 'Users retrieved successfully', {
                users: rows.map((user) => user.toJSON()),
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                },
            });
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }

    /**
     * Get user by ID
     * @route GET /api/v1/users/:id
     */
    public async getById(req: Request, res: Response) {
        try {
            const id = this.getParamId(req);

            if (!id) {
                this.badRequestResponse(res, 'User ID is required');
                return;
            }

            const user = await db.User.findByPk(id);

            if (!user) {
                this.notFoundResponse(res, 'User not found');
                return;
            }

            this.successHandler(
                res,
                'User retrieved successfully',
                user.toJSON()
            );
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }

    /**
     * Update user
     * @route PUT /api/v1/users/:id
     */
    public async update(req: Request, res: Response) {
        try {
            const id = this.getParamId(req);

            if (!id) {
                this.badRequestResponse(res, 'User ID is required');
                return;
            }

            const user = await db.User.findByPk(id);

            if (!user) {
                this.notFoundResponse(res, 'User not found');
                return;
            }

            // Validate input
            const validation = validateObject(req.body, {
                name: { type: 'string', minLength: 2 },
                email: { type: 'email' },
            });

            if (!validation.isValid) {
                this.badRequestResponse(
                    res,
                    'Validation failed',
                    ErrorCodes.DEFAULT,
                    validation.errors
                );
                return;
            }

            // Update user
            await user.update(req.body);

            this.successHandler(
                res,
                'User updated successfully',
                user.toJSON()
            );
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                this.badRequestResponse(
                    res,
                    'Email already exists',
                    ErrorCodes.DEFAULT
                );
            } else {
                this.handleError(res, error as ErrorResponse);
            }
        }
    }

    /**
     * Delete user
     * @route DELETE /api/v1/users/:id
     */
    public async delete(req: Request, res: Response) {
        try {
            const id = this.getParamId(req);

            if (!id) {
                this.badRequestResponse(res, 'User ID is required');
                return;
            }

            const user = await db.User.findByPk(id);

            if (!user) {
                this.notFoundResponse(res, 'User not found');
                return;
            }

            await user.destroy();

            this.successHandler(res, 'User deleted successfully');
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }
}

export default new UserController();
