import { Router } from 'express';
import universitiesApi from '../Api/universities/controller.universities';
const router = Router();

router.get('/getAll', universitiesApi.getAll);

export default router;
