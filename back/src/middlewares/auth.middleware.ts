import { CandidatAuthRequest } from '../utils/interfaces/ModifiedRequestObject';
import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import httpException from '../utils/httpException';

dotenv.config();


export const AuthMiddleware  = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token = req.header('Authorization')?.replace('Bearer ', '');

    if (token == null)
        throw new httpException(401, 'No auth token was provided')

    jsonwebtoken.verify(
        token,
        process.env.JWT_SECRET as string,
        (err, user) => {
            if (err) 
                throw new httpException(403, 'Invalid auth token');
            (req as CandidatAuthRequest).user = user;
            next(); // pass the execution off to whatever request the client intended
        }
    );
}
