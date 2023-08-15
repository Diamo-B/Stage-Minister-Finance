import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import countryService from './service.country';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countries = await countryService.getAll();
        res.status(200).json(countries);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

export default {
    getAll,
};
