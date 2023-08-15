import { Router } from 'express';
import countriesApis from '../Api/countries/controller.country';
const router = Router();

router.get('/getAll', countriesApis.getAll);

export default router;
