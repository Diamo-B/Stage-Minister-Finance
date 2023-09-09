import { UserAuthRequest } from '../utils/interfaces/ModifiedRequestObject';
import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import httpException from '../utils/httpException';

dotenv.config();

export const AuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
        jsonwebtoken.verify(
            token,
            process.env.JWT_SECRET as string,
            (err, decodedToken) => {
                if (!err) {
                    if (decodedToken != null) {
                        // Correct candidat token
                        (req as UserAuthRequest).user = decodedToken;
                        next();
                    } else {
                        // Correct token but doesn't belong to an agent
                        next(new httpException(403, 'Unauthorized'));
                    }
                } else {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            // Token has expired
                            throw new httpException(403, 'Token expired');
                        } else {
                            // Other verification error
                            throw new httpException(403, 'Invalid auth token');
                        }
                    }
                    next(new httpException(401, ''));
                }
            }
        );
    } else {
        // No token found, send error response
        return res.status(401).json({ message: 'No token found' });
    }
};
