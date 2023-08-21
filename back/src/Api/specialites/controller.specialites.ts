import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import specialitesService from './service.specialites';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const specs = await specialitesService.getAll();
        res.status(200).json(specs);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

export default {
    getAll,
};
