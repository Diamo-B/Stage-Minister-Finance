import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import universitiesService from './service.universities';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const universities = await universitiesService.getAll();
        res.status(200).json(universities);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

export default {
    getAll,
};
