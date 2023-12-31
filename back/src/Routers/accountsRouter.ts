import { Router } from 'express';
import validate from '../middlewares/validation.middleware';
import schema from '../Api/accounts/validation.accounts';
import accountsApis from '../Api/accounts/controller.accounts';
import { verifyJWT } from '../utils/JWT/verifyJWT';
import { AuthMiddleware } from '../middlewares/auth.middleware';
const router: Router = Router();

router.post('/login', validate(schema.loginSchema), accountsApis.login);
router.post('/generateRegistrationToken',validate(schema.VerifyCandidatId),accountsApis.generateRegistrationToken);
router.get('/registered', AuthMiddleware, accountsApis.genAccessToken);
router.post(
    '/forgotPassword',
    validate(schema.forgetPasswordSchema),
    accountsApis.sendForgotPasswordEmail
);
router.post('/password/reset', accountsApis.resetPassword);
router.get('/password/verifyToken', AuthMiddleware,accountsApis.verifyResetPasswordToken);
router.get('/verifyToken', verifyJWT);
router.get(
    '/continueRegistration',
    AuthMiddleware,
    accountsApis.findCorrectRegistrationStep
);
router.get('/visitors/verifyPastRegistration', AuthMiddleware, accountsApis.verifyPastRegistration);
export default router;
