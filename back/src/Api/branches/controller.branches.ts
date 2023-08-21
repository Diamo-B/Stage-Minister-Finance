import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import branchesService from './service.branches';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branches = await branchesService.getAll();
        res.status(200).json(branches);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

export default {
    getAll,
};
