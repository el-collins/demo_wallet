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
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletService = exports.WalletService = void 0;
// src/services/walletService.ts
const database_1 = require("../config/database");
const uuid_1 = require("uuid");
const adjutorService_1 = require("./adjutorService");
const Wallet_1 = require("../models/Wallet");
const Transaction_1 = require("../models/Transaction");
class WalletService {
    constructor() {
        this.adjutorService = adjutorService_1.AdjutorService.getInstance();
    }
    createWallet(userId, email, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check blacklist
                const isBlacklisted = yield this.adjutorService.checkKarmaBlacklist(email);
                if (isBlacklisted) {
                    throw new Error("User is blacklisted from the platform");
                }
                const existingWallet = yield trx("wallets")
                    .where("userId", userId)
                    .first();
                if (existingWallet) {
                    throw new Error("Wallet already exists for this user");
                }
                const wallet = {
                    id: (0, uuid_1.v4)(),
                    userId,
                    balance: 0,
                    status: Wallet_1.WalletStatus.ACTIVE,
                    currency: "NGN",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                yield trx("wallets").insert(wallet);
                return wallet;
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        });
    }
    getWalletByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield (0, database_1.db)("wallets").where("userId", userId).first();
                return wallet;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBalance(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield (0, database_1.db)("wallets").where("id", walletId).first();
            if (!wallet) {
                throw new Error("Wallet not found");
            }
            return wallet.balance;
        });
    }
    getAllWallets() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.db)("wallets").select("*");
        });
    }
    fundWallet(walletId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const trx = yield database_1.db.transaction();
            try {
                // Lock the wallet row
                const wallet = yield trx("wallets")
                    .where({ id: walletId, status: Wallet_1.WalletStatus.ACTIVE })
                    .forUpdate()
                    .first();
                if (!wallet) {
                    throw new Error("Wallet not found");
                }
                const transaction = {
                    id: (0, uuid_1.v4)(),
                    walletId,
                    type: Transaction_1.TransactionType.FUNDING,
                    amount,
                    status: Transaction_1.TransactionStatus.PENDING,
                    reference: `FUND-${(0, uuid_1.v4)()}-${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                yield trx("transactions").insert(transaction);
                yield trx("wallets")
                    .where("id", walletId)
                    .increment("balance", amount)
                    .update("updatedAt", new Date());
                (transaction.status = Transaction_1.TransactionStatus.COMPLETED),
                    yield trx("transactions")
                        .where("id", transaction.id)
                        .update("status", "completed");
                yield trx.commit();
                return transaction;
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        });
    }
    transfer(senderWalletId, receiverWalletId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const trx = yield database_1.db.transaction();
            try {
                const [senderWallet, receiverWallet] = yield Promise.all([
                    trx("wallets").where("id", senderWalletId).first(),
                    trx("wallets").where("id", receiverWalletId).first(),
                ]);
                if (!senderWallet) {
                    throw new Error("Invalid sender wallet details");
                }
                if (!receiverWallet) {
                    throw new Error("Invalid Receiver wallet details");
                }
                if (senderWallet.balance < amount) {
                    throw new Error("Insufficient funds");
                }
                const transaction = {
                    id: (0, uuid_1.v4)(),
                    walletId: senderWalletId,
                    type: Transaction_1.TransactionType.TRANSFER,
                    amount,
                    status: Transaction_1.TransactionStatus.PENDING,
                    reference: `TRF-${(0, uuid_1.v4)()}-${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                yield Promise.all([
                    trx("transactions").insert(transaction),
                    trx("wallets").where("id", senderWalletId).decrement("balance", amount),
                    trx("wallets")
                        .where("id", receiverWalletId)
                        .increment("balance", amount),
                ]);
                (transaction.status = Transaction_1.TransactionStatus.COMPLETED),
                    yield trx("transactions")
                        .where("id", transaction.id)
                        .update("status", "completed");
                yield trx.commit();
                return transaction;
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        });
    }
    withdraw(walletId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const wallet = yield trx("wallets")
                    .where({ id: walletId, status: Wallet_1.WalletStatus.ACTIVE })
                    .forUpdate()
                    .first();
                if (!wallet) {
                    throw new Error("Wallet not found or inactive");
                }
                // check if amount is a positive number
                if (amount <= 0) {
                    throw new Error("Invalid amount");
                }
                // check if amount is a negative number
                if (amount < 0) {
                    throw new Error("Invalid amount");
                }
                if (wallet.balance < amount) {
                    throw new Error("Insufficient funds");
                }
                const transaction = {
                    id: (0, uuid_1.v4)(),
                    walletId,
                    type: Transaction_1.TransactionType.WITHDRAWAL,
                    amount,
                    status: Transaction_1.TransactionStatus.COMPLETED,
                    reference: `WTH-${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                yield Promise.all([
                    trx("transactions").insert(transaction),
                    trx("wallets")
                        .where({ id: walletId })
                        .update({
                        balance: database_1.db.raw("balance - ?", [amount]),
                        updatedAt: new Date(),
                    }),
                ]);
                return transaction;
            }));
        });
    }
    getTransactions(walletId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, type } = options;
            const query = (0, database_1.db)("transactions")
                .where("walletId", walletId)
                .orderBy("createdAt", "desc")
                .offset((page - 1) * limit)
                .limit(limit);
            if (type) {
                query.andWhere("type", type);
            }
            const transactions = yield query;
            console.log(transactions);
            return transactions;
        });
    }
}
exports.WalletService = WalletService;
exports.walletService = new WalletService();
