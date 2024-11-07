import express from "express";
import { authenticateToken, authorizeAdmin } from "../middlewares/auth";
import {
  validateFundWallet,
  validateTransfer,
  validateWithdrawal,
} from "../middlewares/validator/walletValidator";
import { walletController } from "../controllers/walletController";

const router = express.Router();

router.use(authenticateToken); // All wallet routes require authentication

/**
 * @swagger
 * /wallets/fund:
 *   post:
 *     summary: Fund a wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Wallet funded successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Wallet not found
 */
router.post("/fund", validateFundWallet, walletController.fundWallet);

/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Get the current user's wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
 *       404:
 *         description: Wallet not found
 */
router.get("/", walletController.getWallet);

/**
 * @swagger
 * /wallets/transfer:
 *   post:
 *     summary: Transfer funds between wallets
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 example: "recipient-wallet-id"
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Bad request
 *       404:
 *         description: Wallet not found
 */
router.post("/transfer", validateTransfer, walletController.transfer);

/**
 * @swagger
 * /wallets/withdraw:
 *   post:
 *     summary: Withdraw funds from a wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Withdrawal initiated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Failed to process withdrawal
 */
router.post("/withdraw", validateWithdrawal, walletController.withdraw);

/**
 * @swagger
 * /wallets/transactions:
 *   get:
 *     summary: Get wallet transactions (funding, transfer, withdrawal)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: "funding"
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *       400:
 *         description: Bad request
 */
router.get("/transactions", walletController.getTransactions);

/**
 * @swagger
 * /wallets/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *       404:
 *         description: Wallet not found
 */
router.get("/balance", walletController.getBalance);

/**
 * @swagger
 * /wallets/all:
 *   get:
 *     summary: Get all wallets (Admin only)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallets retrieved successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Failed to fetch wallets
 */
router.get("/all", authorizeAdmin, walletController.getAllWallets);


export default router;
