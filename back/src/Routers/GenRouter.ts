import { Router } from 'express';
import userRouter from './userRouter';
import cityRouter from './citiesRouter';
import regionRouter from './regionsRouter';
import countriesRouter from "./countriesRouter"
import universitiesRouter from "./universitiesRouter"
import diplomeRouter from "./diplomesRouter"
import attachmentRouter from './attachmentRouter';
import { verifyJWT } from '../utils/JWT/verifyJWT';

const router: Router = Router();
router.use('/user', userRouter);
router.use('/city', cityRouter);
router.use('/region', regionRouter);
router.use('/country', countriesRouter);
router.use('/university', universitiesRouter);
router.use('/diplome', diplomeRouter);
router.use("/attachment", attachmentRouter);
router.get('/verifyToken', verifyJWT);

export default router;
