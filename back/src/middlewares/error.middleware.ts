import { Request, Response, NextFunction } from 'express';
import httpException from '../utils/httpException';
import { ZodError } from 'zod';

// Error-handling middleware
const ErrorMiddleware = (
    err: httpException | ZodError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof httpException) {
        console.error(err.stack);
        res.status(500).json({ status: err.status, error: err.message });
    } else if (err instanceof ZodError) {
        console.error(err);
        res.status(500).json({ status: 400, errors: err.issues });
    }
};

export default ErrorMiddleware;
