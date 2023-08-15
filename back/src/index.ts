import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import ErrorMiddleware from './middlewares/error.middleware';
import GenRouter from './Routers/GenRouter';

dotenv.config();
export const app: Express = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(compression());

app.get('/404', (req: Request, res: Response, next: NextFunction) => {
    throw new Error('Page Not Found');
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.use(`/api/${process.env.API_VERSION}/`, GenRouter);

app.use(ErrorMiddleware);
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
