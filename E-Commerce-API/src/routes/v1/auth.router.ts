import express from 'express';
import authController from '../../controllers/auth.controller';
import authValidation from '../../validations/auth.validation';
import validateSchema from '../../middleware/validateSchema.middleware';
import { authenticateTokenAdmin, authenticateToken } from '../../middleware/auth.middleware';

const router = express.Router();

//Login thì cần method POST
//localhost:3000/api/v1/auth/login
router.post('/login', validateSchema(authValidation.login), authController.login);
router.post('/loginAdmin', validateSchema(authValidation.login), authController.loginAdmin);

router.post('/logout', validateSchema(authValidation.login), authController.logout);

/** Phải nằm trước id */
router.get('/getProfile', authenticateToken, authController.getProfile);
router.get('/getProfileAdmin', authenticateTokenAdmin, authController.getProfileAdmin);

/** Phải nằm trước id */
router.get('/refresh-token', authenticateToken, authController.freshToken);
router.get('/refresh-token-admin', authenticateTokenAdmin, authController.freshTokenAdmin);

export default router;
