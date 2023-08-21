import {Router} from 'express'
import postesApis from '../Api/postes/controller.postes';
const router = Router();

router.get('/getAll', postesApis.getAll);

export default router;