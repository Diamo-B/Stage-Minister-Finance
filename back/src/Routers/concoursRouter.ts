import { Router } from 'express';
import concoursApis from '../Api/concours/controller.concours';
import schema from '../Api/concours/validation.concours';
import validate from '../middlewares/validation.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.post('/create', validate(schema.create), concoursApis.create);
router.get('/getAll', concoursApis.getAll);

//explain: this route gets all the concours with only the useFul information to include in the front-end (visitor)
router.get('/getAll/useful', concoursApis.getAll_W_UsefulPropsOnly);

//explain: this route gets all the concours with only the useFul information to include in the front-end, in addition to the links between the current user and the concours he applied to. (signedIn user)
router.get('/getAll/useful/withUserAssignments', AuthMiddleware, concoursApis.getAll_W_usefulProps_userAssignments);



export default router;
