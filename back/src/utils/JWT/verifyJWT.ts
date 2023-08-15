import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import httpException from '../httpException';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        throw new httpException(401, 'No token provided');
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            throw new httpException(403, 'Unauthorized');
        }        
        return res.status(200).json(decoded);
    });
};