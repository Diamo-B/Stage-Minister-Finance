import { Router } from 'express';
import usersApis from '../Api/users/controller.user';
import validate from '../middlewares/validation.middleware';
import schema from '../Api/users/validation.user';
import {AuthMiddleware}  from '../middlewares/auth.middleware';

const router: Router = Router();

router.get('/getAll', usersApis.getAll);
router.get('/getone/id/:id', validate(schema.getOneId), usersApis.getOneId);
router.get('/getone/cin/:cin', validate(schema.getOneCin), usersApis.getOneCin);
router.get('/getone/candidat/:id', validate(schema.getOneId), usersApis.getOneCandidat);
router.get(
    '/getone/email/:email',
    validate(schema.getOneEmail),
    usersApis.getOneEmail
);
router.post(
    '/register/check',
    validate(schema.checkRegistration),
    usersApis.checkRegistration
);
router.post(
    '/register/verification/sendMail',
    validate(schema.sendMail),
    usersApis.sendMail
);
router.post('/create', validate(schema.create), usersApis.create);
router.post(
    '/create/candidat',
    validate(schema.createCandidat),
    usersApis.createCandidat
);

router.patch(
    '/update/candidat',
    AuthMiddleware,
    validate(schema.update),
    usersApis.updateCandidat
);

router.patch(
    '/update/candidat/status',
    AuthMiddleware,
    validate(schema.changeStatus),
    usersApis.changeCandidatStatus
)

//explain: Adds CIN and CV to candidat
router.patch(
    '/link/candidat',
    AuthMiddleware,
    usersApis.linkAttachmentsToCandidat
);

/*
router.post(
    '/create/admin',
    validate(schema.createAdmin),
    usersApis.createAdmin
); */
router.patch('/update/:id', validate(schema.update), usersApis.update);
router.delete('/delete/:id', validate(schema.remove), usersApis.remove);
router.delete('/deleteMany', validate(schema.removeMany), usersApis.removeMany);
router.delete('/deleteAll', usersApis.removeAll);

export default router;
