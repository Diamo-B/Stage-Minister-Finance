import { Router } from 'express';
import branchesApis from '../Api/branches/controller.branches';
const router = Router();

router.get('/getAll', branchesApis.getAll);

export default router;
