import { Request, Response } from 'express';
import { ErrorObject } from '@types';
import ErrorCodes from '@constant/ErrorCodes';
import ResponseHandler from './ResponseHandler';

class BaseController extends ResponseHandler {
    constructor() {
        super();
    }

    /**
     * Get ID from query parameters
     */
    protected getQueryId(req: Request, key = 'id'): number | undefined {
        const id = req.query?.[key];
        if (!id || isNaN(Number(id))) {
            return undefined;
        }
        return Number(id);
    }

    /**
     * Get ID from route parameters
     */
    protected getParamId(req: Request, key = 'id'): number | undefined {
        const id = req.params?.[key];
        if (!id || isNaN(Number(id))) {
            return undefined;
        }
        return Number(id);
    }

    /**
     * Validate and convert value type
     */
    private validateValueType<T>(value: unknown): T {
        if (typeof value === 'string') {
            if (typeof ({} as T) === 'number') {
                return Number(value) as T;
            }
            if (typeof ({} as T) === 'boolean') {
                return (value === 'true') as T;
            }
        }

        return value as T;
    }

    /**
     * Get value from route parameters
     */
    protected getParamValue<T = string>(req: Request, key: string): T {
        const value = req.params?.[key];
        return this.validateValueType<T>(value);
    }

    /**
     * Get value from query parameters
     */
    protected getQueryValue<T = string>(req: Request, key: string): T {
        const value = req.query?.[key];
        return this.validateValueType<T>(value);
    }

    /**
     * Get value from request body
     */
    protected getBodyValue<T = string>(req: Request, key: string): T {
        const value = req.body?.[key];
        return this.validateValueType<T>(value);
    }

    /**
     * Handle errors in a consistent way
     */
    protected handleError<
        ErrorT extends Record<string, any> = Record<string, any>
    >(res: Response, error: ErrorObject<ErrorT>) {
        this.badRequestResponse(
            res,
            error?.message,
            error?.code ?? ErrorCodes.DEFAULT,
            error?.data
        );
    }
}

export default BaseController;
