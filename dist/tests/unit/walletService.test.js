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
const database_1 = require("../../src/config/database");
const Transaction_1 = require("../../src/models/Transaction");
const Wallet_1 = require("../../src/models/Wallet");
const adjutorService_1 = require("../../src/services/adjutorService");
const walletService_1 = require("../../src/services/walletService");
// Mock dependencies
jest.mock('../../config/database', () => ({
    db: {
        transaction: jest.fn(),
        raw: jest.fn(),
    },
}));
jest.mock('../../services/adjutorService', () => ({
    AdjutorService: {
        getInstance: jest.fn(() => ({
            checkKarmaBlacklist: jest.fn(),
        })),
    },
}));
describe('WalletService', () => {
    let mockTrx;
    beforeEach(() => {
        jest.clearAllMocks();
        mockTrx = {
            commit: jest.fn(),
            rollback: jest.fn(),
            where: jest.fn().mockReturnThis(),
            first: jest.fn(),
            insert: jest.fn(),
            forUpdate: jest.fn().mockReturnThis(),
            increment: jest.fn().mockReturnThis(),
            decrement: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
        };
        database_1.db.transaction.mockImplementation((fn) => fn(mockTrx));
    });
    describe('createWallet', () => {
        const userId = 'test-user-id';
        const email = 'test@example.com';
        it('should create a wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock dependencies
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue(null);
            adjutorService_1.AdjutorService.getInstance().checkKarmaBlacklist.mockResolvedValue(false);
            // Execute
            const wallet = yield walletService_1.walletService.createWallet(userId, email, mockTrx);
            // Assert
            expect(wallet).toBeDefined();
            expect(wallet.userId).toBe(userId);
            expect(wallet.balance).toBe(0);
            expect(wallet.status).toBe(Wallet_1.WalletStatus.ACTIVE);
            expect(mockTrx.insert).toHaveBeenCalled();
        }));
        it('should throw error if user is blacklisted', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock blacklist check
            adjutorService_1.AdjutorService.getInstance().checkKarmaBlacklist.mockResolvedValue(true);
            // Execute and assert
            yield expect(walletService_1.walletService.createWallet(userId, email, mockTrx))
                .rejects
                .toThrow('User is blacklisted from the platform');
        }));
        it('should throw error if wallet already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock existing wallet
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue({ id: 'existing-wallet' });
            adjutorService_1.AdjutorService.getInstance().checkKarmaBlacklist.mockResolvedValue(false);
            // Execute and assert
            yield expect(walletService_1.walletService.createWallet(userId, email, mockTrx))
                .rejects
                .toThrow('Wallet already exists for this user');
        }));
    });
    describe('fundWallet', () => {
        const walletId = 'test-wallet-id';
        const amount = 1000;
        it('should fund wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock wallet existence
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue({ id: walletId, balance: 0, status: Wallet_1.WalletStatus.ACTIVE });
            // Execute
            const transaction = yield walletService_1.walletService.fundWallet(walletId, amount);
            // Assert
            expect(transaction).toBeDefined();
            expect(transaction.type).toBe(Transaction_1.TransactionType.FUNDING);
            expect(transaction.amount).toBe(amount);
            expect(transaction.status).toBe(Transaction_1.TransactionStatus.COMPLETED);
            expect(mockTrx.increment).toHaveBeenCalledWith('balance', amount);
        }));
        it('should throw error if wallet not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock wallet not found
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue(null);
            // Execute and assert
            yield expect(walletService_1.walletService.fundWallet(walletId, amount))
                .rejects
                .toThrow('Wallet not found');
        }));
    });
    describe('transfer', () => {
        const senderWalletId = 'sender-wallet-id';
        const receiverWalletId = 'receiver-wallet-id';
        const amount = 500;
        it('should transfer funds successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTrx = {
                commit: jest.fn(),
                rollback: jest.fn(),
                where: jest.fn().mockReturnThis(),
                first: jest.fn(),
                insert: jest.fn(),
                forUpdate: jest.fn().mockReturnThis(),
                increment: jest.fn().mockReturnThis(),
                decrement: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
            };
            mockTrx.where.mockImplementation((criteria) => {
                if (criteria.id === senderWalletId) {
                    mockTrx.first.mockResolvedValue({ id: senderWalletId, balance: 1000 });
                }
                else {
                    mockTrx.first.mockResolvedValue({ id: receiverWalletId, balance: 0 });
                }
                return mockTrx;
            });
            // Execute
            const transaction = yield walletService_1.walletService.transfer(senderWalletId, receiverWalletId, amount);
            // Assert
            expect(transaction).toBeDefined();
            expect(transaction.type).toBe(Transaction_1.TransactionType.TRANSFER);
            expect(transaction.amount).toBe(amount);
            expect(mockTrx.decrement).toHaveBeenCalledWith('balance', amount);
            expect(mockTrx.increment).toHaveBeenCalledWith('balance', amount);
        }));
        it('should throw error if sender has insufficient funds', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock sender wallet with insufficient balance
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue({ id: senderWalletId, balance: 100 });
            // Execute and assert
            yield expect(walletService_1.walletService.transfer(senderWalletId, receiverWalletId, amount))
                .rejects
                .toThrow('Insufficient funds');
        }));
    });
    describe('withdraw', () => {
        const walletId = 'test-wallet-id';
        const amount = 200;
        it('should process withdrawal successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock wallet with sufficient balance
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue({ id: walletId, balance: 500, status: Wallet_1.WalletStatus.ACTIVE });
            // Execute
            const transaction = yield walletService_1.walletService.withdraw(walletId, amount);
            // Assert
            expect(transaction).toBeDefined();
            expect(transaction.type).toBe(Transaction_1.TransactionType.WITHDRAWAL);
            expect(transaction.amount).toBe(amount);
            expect(transaction.status).toBe(Transaction_1.TransactionStatus.COMPLETED);
            expect(mockTrx.update).toHaveBeenCalled();
        }));
        it('should throw error if withdrawal amount is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue({ id: walletId, balance: 500, status: Wallet_1.WalletStatus.ACTIVE });
            // Execute and assert
            yield expect(walletService_1.walletService.withdraw(walletId, -100))
                .rejects
                .toThrow('Invalid amount');
        }));
        it('should throw error if insufficient funds', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock wallet with insufficient balance
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue({ id: walletId, balance: 100, status: Wallet_1.WalletStatus.ACTIVE });
            // Execute and assert
            yield expect(walletService_1.walletService.withdraw(walletId, amount))
                .rejects
                .toThrow('Insufficient funds');
        }));
    });
});
