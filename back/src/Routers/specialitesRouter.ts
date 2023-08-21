import { Router } from 'express';
import specsApis from '../Api/specialites/controller.specialites';
const router = Router();

router.get('/getAll', specsApis.getAll);

export default router;
