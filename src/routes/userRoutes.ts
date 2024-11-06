import express from 'express';
import { authenticateToken } from '../middlewares/auth';
import { validateCreateUser } from '../middlewares/validator/userValidator';
import UserController from '../controllers/userController';



const router = express.Router();


router.post('/', validateCreateUser, UserController.createUser);
// router.get('/me', authenticateToken, UserController.getProfile);

export default router;