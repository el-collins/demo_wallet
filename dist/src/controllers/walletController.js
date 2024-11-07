"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletController = exports.WalletController = void 0;
const walletService_1 = require("../services/walletService");
const logger_1 = __importDefault(require("../utils/logger"));
const response_1 = require("../utils/response");
class WalletController {
    constructor() {
        this.createWallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, email } = req.user;
                const wallet = yield walletService_1.walletService.createWallet(userId, email);
                (0, response_1.success)(res, "Wallet created successfully", wallet);
            }
            catch (error) {
                logger_1.default.error("Error creating wallet:", error);
                if (error.message === "User is blacklisted from the platform") {
                    (0, response_1.forbidden)(res, error.message);
                }
                (0, response_1.handleError)(res, error);
            }
        });
        this.getWallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    (0, response_1.forbidden)(res, "User ID is required");
                }
                const wallet = yield walletService_1.walletService.getWalletByUserId(userId);
                if (!wallet) {
                    (0, response_1.notFound)(res, "Wallet not found");
                }
                (0, response_1.success)(res, "Wallet retrieved successfully", wallet);
            }
            catch (error) {
                logger_1.default.error("Error fetching wallet:", error);
                (0, response_1.serverError)(res, "Failed to fetch wallet details");
            }
        });
        this.getAllWallets = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const wallets = yield walletService_1.walletService.getAllWallets();
                (0, response_1.success)(res, "Wallets retrieved successfully", wallets);
            }
            catch (error) {
                logger_1.default.error("Error fetching wallets:", error);
                (0, response_1.serverError)(res, "Failed to fetch wallets");
            }
        });
        this.fundWallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { amount } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    (0, response_1.forbidden)(res, "User ID is required");
                }
                const { id } = yield walletService_1.walletService.getWalletByUserId(userId);
                const transaction = yield walletService_1.walletService.fundWallet(id, amount);
                (0, response_1.success)(res, "Wallet funded successfully", {
                    transaction,
                });
            }
            catch (error) {
                logger_1.default.error("Error funding wallet:", error);
                if (error.message === "Wallet not found") {
                    (0, response_1.notFound)(res, "Wallet not found");
                }
                if (error.message === "Wallet is not active") {
                    (0, response_1.badRequest)(res, "Wallet is not in active status");
                }
                (0, response_1.serverError)(res, "Failed to fund wallet");
            }
        });
        this.transfer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { recipientId, amount } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    (0, response_1.forbidden)(res, "User ID is required");
                }
                const { id: senderWalletId } = yield walletService_1.walletService.getWalletByUserId(userId);
                const { id: receiverWalletId } = yield walletService_1.walletService.getWalletByUserId(recipientId);
                console.log(receiverWalletId);
                const transaction = yield walletService_1.walletService.transfer(senderWalletId, receiverWalletId, amount);
                (0, response_1.handleResponse)(res, 200, "Transfer successful", transaction);
            }
            catch (error) {
                logger_1.default.error("Error transferring funds:", error);
                if (error.message === "Insufficient funds") {
                    (0, response_1.badRequest)(res, "Insufficient funds for transfer");
                }
                if (error.message === "Invalid wallet details") {
                    (0, response_1.notFound)(res, "Invalid recipient details");
                }
                (0, response_1.serverError)(res, "Failed to process transfer");
            }
        });
        this.withdraw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { amount } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    (0, response_1.forbidden)(res, "User ID is required");
                }
                const { id: walletId } = yield walletService_1.walletService.getWalletByUserId(userId);
                const transaction = yield walletService_1.walletService.withdraw(walletId, amount);
                (0, response_1.handleResponse)(res, 200, "Withdrawal initiated successfully", transaction);
            }
            catch (error) {
                logger_1.default.error("Error processing withdrawal:", error);
                if (error.message === "Insufficient funds") {
                    (0, response_1.badRequest)(res, "Insufficient funds for withdrawal");
                }
                (0, response_1.serverError)(res, "Failed to process withdrawal");
            }
        });
        this.getTransactions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { page, limit, type } = req.query;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { id: walletId } = yield walletService_1.walletService.getWalletByUserId(userId);
                const transactions = yield walletService_1.walletService.getTransactions(walletId, {
                    page: Number(page),
                    limit: Number(limit),
                    type: type,
                });
                (0, response_1.handleResponse)(res, 200, "Transactions retrieved successfully", transactions);
            }
            catch (error) {
                logger_1.default.error("Error fetching transactions:", error);
                (0, response_1.handleError)(res, "Failed to fetch transactions");
            }
        });
        this.getBalance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { id: walletId } = yield walletService_1.walletService.getWalletByUserId(userId);
                const balance = yield walletService_1.walletService.getBalance(walletId);
                (0, response_1.handleResponse)(res, 200, "Balance retrieved successfully", { balance });
            }
            catch (error) {
                logger_1.default.error("Error fetching balance:", error);
                (0, response_1.handleError)(res, "Failed to fetch wallet balance");
            }
        });
    }
}
exports.WalletController = WalletController;
exports.walletController = new WalletController();
