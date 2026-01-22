/**
 * Validation utilities
 * Simple validation helpers without external dependencies
 * For complex validation, consider using Zod, Joi, or express-validator
 */

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Password validation (minimum 8 characters, at least one letter and one number)
 */
export const isValidPassword = (password: string): boolean => {
    if (password.length < 8) return false;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
};

/**
 * String validation
 */
export const isValidString = (
    value: unknown,
    minLength = 1,
    maxLength = 255
): boolean => {
    if (typeof value !== 'string') return false;
    if (value.length < minLength) return false;
    if (value.length > maxLength) return false;
    return true;
};

/**
 * Number validation
 */
export const isValidNumber = (
    value: unknown,
    min?: number,
    max?: number
): boolean => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
};

/**
 * Required field validation
 */
export const isRequired = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
};

/**
 * Validate object against rules
 */
export const validateObject = (
    data: Record<string, any>,
    rules: Record<string, ValidationRule>
): ValidationResult => {
    const errors: ValidationError[] = [];

    for (const [field, rule] of Object.entries(rules)) {
        const value = data[field];

        // Required validation
        if (rule.required && !isRequired(value)) {
            errors.push({
                field,
                message: rule.requiredMessage || `${field} is required`,
                code: 'REQUIRED',
            });
            continue;
        }

        // Skip further validation if field is optional and empty
        if (!rule.required && !isRequired(value)) {
            continue;
        }

        // Type validation
        if (rule.type === 'email' && !isValidEmail(value)) {
            errors.push({
                field,
                message: rule.message || 'Invalid email format',
                code: 'INVALID_EMAIL',
            });
        }

        if (rule.type === 'password' && !isValidPassword(value)) {
            errors.push({
                field,
                message:
                    rule.message ||
                    'Password must be at least 8 characters with letters and numbers',
                code: 'INVALID_PASSWORD',
            });
        }

        if (
            rule.type === 'string' &&
            !isValidString(value, rule.minLength, rule.maxLength)
        ) {
            errors.push({
                field,
                message:
                    rule.message ||
                    `${field} must be between ${rule.minLength || 1} and ${rule.maxLength || 255} characters`,
                code: 'INVALID_STRING',
            });
        }

        if (
            rule.type === 'number' &&
            !isValidNumber(value, rule.min, rule.max)
        ) {
            errors.push({
                field,
                message:
                    rule.message ||
                    `${field} must be a number${rule.min !== undefined ? ` >= ${rule.min}` : ''}${rule.max !== undefined ? ` <= ${rule.max}` : ''}`,
                code: 'INVALID_NUMBER',
            });
        }

        // Custom validation
        if (rule.custom && !rule.custom(value)) {
            errors.push({
                field,
                message: rule.message || `${field} is invalid`,
                code: 'CUSTOM_VALIDATION_FAILED',
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export interface ValidationRule {
    required?: boolean;
    requiredMessage?: string;
    type?: 'string' | 'number' | 'email' | 'password';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    message?: string;
    custom?: (value: any) => boolean;
}

/**
 * Example usage:
 *
 * const rules = {
 *     email: { required: true, type: 'email' },
 *     password: { required: true, type: 'password' },
 *     age: { type: 'number', min: 18, max: 100 },
 *     name: { required: true, type: 'string', minLength: 2, maxLength: 50 }
 * };
 *
 * const result = validateObject(req.body, rules);
 * if (!result.isValid) {
 *     return res.status(400).json({ errors: result.errors });
 * }
 */
