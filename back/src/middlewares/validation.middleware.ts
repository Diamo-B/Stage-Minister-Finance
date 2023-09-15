import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validateRequestData = (schema: z.Schema<any>) => {
        return (req: Request, res: Response, next: NextFunction) => {
        try {
            let dataToValidate:any = {};

            if (Object.keys(req.body).length > 0) {
                dataToValidate = { ...dataToValidate, ...req.body };
            }

            if (Object.keys(req.params).length > 0) {
                dataToValidate = { ...dataToValidate, ...req.params };
            }

            // Validate the data against the schema
            schema.parse(dataToValidate);
            next();
        } catch (error: any) {
            // If validation fails, return a 400 Bad Request response with the validation error
            next(error);
        }
    };
};

export default validateRequestData;
