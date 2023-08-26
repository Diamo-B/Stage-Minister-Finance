import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import ErrorMiddleware from './middlewares/error.middleware';
import GenRouter from './Routers/GenRouter';
import fileUpload from 'express-fileupload';

dotenv.config();
export const app: Express = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(compression());
// Use the express-fileupload middleware
app.use(fileUpload());

app.use(`/api/${process.env.API_VERSION}/`, GenRouter);

app.use(ErrorMiddleware);
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
