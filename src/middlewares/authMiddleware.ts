import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ErrorCodes from '@constant/ErrorCodes';
import { ENV } from '@constant/Environment';

interface AuthPayload {
    sub: string; // user.id
    [key: string]: any; // additional fields
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                [key: string]: any;
            };
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            code: ErrorCodes.AUTH_UNAUTHORIZED_USER,
            message: 'Missing or invalid Authorization header',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env[ENV.JWT_SECRET_KEY]!
        ) as AuthPayload;

        req.user = {
            id: decoded.sub,
            ...decoded,
        };

        return next();
    } catch (error) {
        return res.status(401).json({
            code: ErrorCodes.AUTH_UNAUTHORIZED_USER,
            message: 'Invalid or expired token',
        });
    }
};

export default authMiddleware;
