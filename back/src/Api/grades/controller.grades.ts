import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import gradesService from './service.grades';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const grades = await gradesService.getAll();
        res.status(200).json(grades);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

export default {
    getAll,
};
