import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpException from '../httpException';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        throw new httpException(401, 'No token provided');
    }
    jwt.verify( 
        token,
        process.env.JWT_SECRET as string,
        (err: any, decoded: any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    // Token has expired
                    throw new httpException(
                        403,
                        'Token expired' 
                    );
                } else {
                    // Other verification error
                    throw new httpException(403, 'Unauthorized');
                }
            }
            console.log(decoded);
            return res.status(200).json(decoded);
        }
    );
};
