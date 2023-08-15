import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validateRequestData = (schema: z.Schema<any>) => {
        return (req: Request, res: Response, next: NextFunction) => {
        try {
            let dataToValidate;

            // Check if the request has a body property, meaning it's a POST request
            if (Object.keys(req.body).length > 0) {                
                dataToValidate = req.body;
            } else {
                // If it doesn't have a body property, it's a GET request, so use req.params
                dataToValidate = req.params;
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
