import { Router } from 'express';
import citiesApi from '../Api/cities/controller.city';
const router: Router = Router();

router.get('/getAll', citiesApi.getAll);
router.get('/getAll/no-regions', citiesApi.getAllWithoutRegion);

export default router;
