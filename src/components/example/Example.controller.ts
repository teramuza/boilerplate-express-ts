import { Request, Response } from 'express';
import BaseController from '@lib/base/BaseController';
import { ErrorResponse } from '@types';
import { validateObject } from '@util/validationUtils';

class ExampleController extends BaseController {
    /**
     * Get all items
     * @route GET /api/v1/example
     */
    public async getAll(req: Request, res: Response) {
        try {
            // Example: pagination
            const page = this.getQueryValue<number>(req, 'page') || 1;
            const limit = this.getQueryValue<number>(req, 'limit') || 10;

            // TODO: Implement your logic here (fetch from database)
            const data = [
                { id: 1, name: 'Item 1', description: 'First item' },
                { id: 2, name: 'Item 2', description: 'Second item' },
            ];

            const response = {
                data,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: 2,
                    totalPages: 1,
                },
            };

            this.successHandler(res, 'Data retrieved successfully', response);
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }

    /**
     * Get item by ID
     * @route GET /api/v1/example/:id
     */
    public async getById(req: Request, res: Response) {
        try {
            const id = this.getParamId(req);

            if (!id) {
                this.badRequestResponse(res, 'ID is required');
                return;
            }

            // TODO: Implement your logic here (fetch from database)
            const data = { id, name: `Item ${id}`, description: 'Example item' };

            this.successHandler(res, 'Data retrieved successfully', data);
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }

    /**
     * Create new item
     * @route POST /api/v1/example
     */
    public async create(req: Request, res: Response) {
        try {
            // Validation
            const validation = validateObject(req.body, {
                name: {
                    required: true,
                    type: 'string',
                    minLength: 3,
                    maxLength: 50,
                },
                description: {
                    required: false,
                    type: 'string',
                    maxLength: 200,
                },
            });

            if (!validation.isValid) {
                this.badRequestResponse(
                    res,
                    'Validation failed',
                    40001,
                    validation.errors
                );
                return;
            }

            const { name, description } = req.body;

            // TODO: Implement your logic here (save to database)
            const data = {
                id: Date.now(),
                name,
                description: description || null,
                createdAt: new Date().toISOString(),
            };

            this.successHandler(res, 'Data created successfully', data);
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }

    /**
     * Update item by ID
     * @route PUT /api/v1/example/:id
     */
    public async update(req: Request, res: Response) {
        try {
            const id = this.getParamId(req);

            if (!id) {
                this.badRequestResponse(res, 'ID is required');
                return;
            }

            // Validation
            const validation = validateObject(req.body, {
                name: {
                    required: false,
                    type: 'string',
                    minLength: 3,
                    maxLength: 50,
                },
                description: {
                    required: false,
                    type: 'string',
                    maxLength: 200,
                },
            });

            if (!validation.isValid) {
                this.badRequestResponse(
                    res,
                    'Validation failed',
                    40001,
                    validation.errors
                );
                return;
            }

            const { name, description } = req.body;

            // TODO: Implement your logic here (update in database)
            const data = {
                id,
                name,
                description,
                updatedAt: new Date().toISOString(),
            };

            this.successHandler(res, 'Data updated successfully', data);
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }

    /**
     * Delete item by ID
     * @route DELETE /api/v1/example/:id
     */
    public async delete(req: Request, res: Response) {
        try {
            const id = this.getParamId(req);

            if (!id) {
                this.badRequestResponse(res, 'ID is required');
                return;
            }

            // TODO: Implement your logic here (delete from database)

            this.successHandler(res, 'Data deleted successfully', { id });
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }
}

export default new ExampleController();
