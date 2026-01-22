/**
 * Common interfaces used across the application
 * Add your custom interfaces here
 */

export interface ApiResponse<T = any> {
    message?: string;
    data?: T;
}
