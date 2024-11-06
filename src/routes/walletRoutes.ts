import express from 'express';
import { WalletController } from '../controllers/walletController';
import { authenticateToken } from '../middlewares/auth';
import { 
  validateCreateWallet,
  validateFundWallet,
  validateTransfer,
  validateWithdrawal
} from '../middlewares/validators/walletValidator';

const router = express.Router();
const walletController = new WalletController();

router.use(authenticateToken); // All wallet routes require authentication

router.post('/', validateCreateWallet, walletController.createWallet);
router.get('/', walletController.getWallet);
router.post('/fund', validateFundWallet, walletController.fundWallet);
router.post('/transfer', validateTransfer, walletController.transfer);
router.post('/withdraw', validateWithdrawal, walletController.withdraw);
router.get('/transactions', walletController.getTransactions);
router.get('/balance', walletController.getBalance);

export default router;