/**
 * Common types used across the application
 */

export type ValueOf<T> = T[keyof T];

export interface ErrorObject<T = undefined> {
    code?: number;
    message?: string;
    data?: T;
}

export type ErrorResponse<Data = Record<string, any>> = ErrorObject<Data>;
