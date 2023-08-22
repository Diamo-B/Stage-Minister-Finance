import { Router } from 'express';
import diplomesApis from '../Api/diplomes/controller.diplomas';
import validate from '../middlewares/validation.middleware';
import schema from '../Api/diplomes/validation.diplomas';
import { AuthMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.get('/getAll', diplomesApis.getAll);
router.get('/getAll/types', diplomesApis.getAllDiplomeTypes);
router.get('/getAll/filieres', diplomesApis.getAllDiplomeFillieres);
router.get('/getAll/specs', diplomesApis.getAllDiplomeSpecialities);
router.get('/getAll/byCandidat', AuthMiddleware, diplomesApis.getAllByCandidatId);
router.post('/create', AuthMiddleware, validate(schema.create), diplomesApis.create);
router.delete('/delete', validate(schema.deleteDiplome),diplomesApis.deleteDiplome);
export default router;
