import { Router } from 'express';
import concoursApis from '../Api/concours/controller.concours';
import schema from '../Api/concours/validation.concours';
import validate from '../middlewares/validation.middleware';
const router = Router();

router.post('/create', validate(schema.create), concoursApis.create);

export default router;
