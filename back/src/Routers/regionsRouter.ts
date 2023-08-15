import {Router} from 'express'
import regionsApis from '../Api/regions/controller.region'
const router = Router();

router.get('/getAll', regionsApis.getAll);
router.get('/getAll/no-cities', regionsApis.getAllWithoutCities);

export default router;