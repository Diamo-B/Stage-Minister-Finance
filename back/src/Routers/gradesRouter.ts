import { Router } from 'express';
import gradesApis from '../Api/grades/controller.grades';
const router = Router();

router.get('/getAll', gradesApis.getAll);

export default router;
