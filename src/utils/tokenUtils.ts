import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

export interface TokenPayload {
    sub: string; // subject (usually user ID)
    [key: string]: any; // additional data
}

/**
 * Generate a JWT token
 */
export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

/**
 * Decode a JWT token without verifying
 */
export const decodeToken = (token: string): TokenPayload | null => {
    return jwt.decode(token) as TokenPayload | null;
};
