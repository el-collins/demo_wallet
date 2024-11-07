"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/walletRoutes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const walletValidator_1 = require("../middlewares/validator/walletValidator");
const walletController_1 = require("../controllers/walletController");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken); // All wallet routes require authentication
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
router.post("/fund", walletValidator_1.validateFundWallet, walletController_1.walletController.fundWallet);
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
router.get("/", walletController_1.walletController.getWallet);
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
router.post("/transfer", walletValidator_1.validateTransfer, walletController_1.walletController.transfer);
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
router.post("/withdraw", walletValidator_1.validateWithdrawal, walletController_1.walletController.withdraw);
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
router.get("/transactions", walletController_1.walletController.getTransactions);
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
router.get("/balance", walletController_1.walletController.getBalance);
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
router.get("/all", auth_1.authorizeAdmin, walletController_1.walletController.getAllWallets);
exports.default = router;
