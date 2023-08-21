import { Router } from 'express';
import directionApis from '../Api/directions/controller.directions';
const router = Router();

router.get('/getAll', directionApis.getAll);


export default router;