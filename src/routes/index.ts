import express from 'express';
import userRoutes from './userRoutes';
import walletRoutes from './walletRoutes';

const router = express.Router();

router.use('/users', userRoutes);
// router.use('/wallets', walletRoutes);

export default router;