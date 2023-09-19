import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import ErrorMiddleware from './middlewares/error.middleware';
import GenRouter from './Routers/GenRouter';
import fileUpload from 'express-fileupload';

import { $env } from './env';
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

app.use(`/api/${$env.API_VERSION}/`, GenRouter);

app.use(ErrorMiddleware);
app.listen($env.PORT, () => {
    console.log(`Server running on port ${$env.PORT}`);
});
