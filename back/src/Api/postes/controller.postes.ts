import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import postesService from './service.postes';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postes = await postesService.getAll();
        res.status(200).json(postes);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

export default {
    getAll,
};
