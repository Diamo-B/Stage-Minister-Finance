import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import cityService from './service.city';


const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cities = await cityService.getAll();
        res.status(200).json(cities);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getAllWithoutRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cities = await cityService.getAllWithoutRegion();
        res.status(200).json(cities);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};
    


export default {
    getAll,
    getAllWithoutRegion
};
