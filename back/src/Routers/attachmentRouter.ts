import { Router } from 'express';
import attachmentApi from '../Api/attachments/controller.attachments';
import validate from '../middlewares/validation.middleware';
import schema from '../Api/attachments/validation.attachments';
import { AuthMiddleware } from '../middlewares/auth.middleware';
const router: Router = Router();

router.get('/getAll/candidat', AuthMiddleware, attachmentApi.getByCandidatID);
router.post('/create', validate(schema.create), attachmentApi.create);
router.delete('/delete/:id', validate(schema.deleteById), attachmentApi.deleteById);

export default router;
