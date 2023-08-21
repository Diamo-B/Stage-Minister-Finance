import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import directionService from './service.directions';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const diplomes = await directionService.getAll();
        res.status(200).json(diplomes);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

export default {
    getAll
};
