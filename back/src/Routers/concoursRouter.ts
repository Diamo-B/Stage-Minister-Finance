import { Router } from 'express';
import concoursApis from '../Api/concours/controller.concours';
import schema from '../Api/concours/validation.concours';
import validate from '../middlewares/validation.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.get('/getAll', concoursApis.getAll);
router.get('/get/:id',validate(schema.getById),concoursApis.getById);

//explain: this route gets all the concours with only the useFul information to include in the front-end (visitor)
router.get('/getAll/useful', concoursApis.getAll_W_UsefulPropsOnly);

//explain: this route gets all the concours with only the useFul information to include in the front-end, in addition to the links between the current user and the concours he applied to. (signedIn user)
router.get('/getAll/useful/withUserAssignments', AuthMiddleware, concoursApis.getAll_W_usefulProps_userAssignments);

//explain: this route gets the combination of each concours alongside the candidats that applied to it, and the city where they'll pass the exam
router.get(
    '/examination/getAll/:concoursId',
    AuthMiddleware,
    validate(schema.getExaminationSiteDetails),
    concoursApis.getExaminationSiteDetails
);

router.get(
    '/:concoursId/getResults',
    AuthMiddleware,
    validate(schema.getResults),
    concoursApis.getResults
);

//explain: this route updates the concours exam center for the candidats of each city
router.put(
    '/examination/validate/:concoursId',
    AuthMiddleware,
    validate(schema.ChangeExaminationSiteDetails),
    concoursApis.ChangeExaminationSiteDetails
);

//explain: create a new concours
router.post('/create', AuthMiddleware, validate(schema.create), concoursApis.create);

//explain: ends a concours (changes it's status to "ended")
router.patch('/end', AuthMiddleware, validate(schema.updateStatus), concoursApis.updateStatus);

//explain: sets the results of a concours
router.post(
    '/:concoursId/setResults',
    AuthMiddleware,
    validate(schema.setResults),
    concoursApis.setResults
);

//explain: updates a concours
router.put('/update/:id', AuthMiddleware, concoursApis.update);

//explain: deletes a concours
router.delete('/delete/:id', AuthMiddleware, validate(schema.remove),concoursApis.remove);

export default router;
