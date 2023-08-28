import { Router } from 'express';
import concoursApis from '../Api/concours/controller.concours';
import schema from '../Api/concours/validation.concours';
import validate from '../middlewares/validation.middleware';
const router = Router();

router.post('/create', validate(schema.create), concoursApis.create);
router.get('/getAll', concoursApis.getAll);
router.get('/getAll/useful', concoursApis.getAll_W_UsefulPropsOnly);

export default router;
