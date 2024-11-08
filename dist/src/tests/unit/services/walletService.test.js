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
const walletService_1 = require("../../../services/walletService");
const database_1 = require("../../../config/database");
const Wallet_1 = require("../../../models/Wallet");
const uuid_1 = require("uuid");
jest.mock('../../../config/database');
describe('WalletService', () => {
    let walletService;
    let mockTransaction;
    beforeEach(() => {
        walletService = new walletService_1.WalletService();
        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
            table: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            update: jest.fn().mockResolvedValue(1),
            insert: jest.fn().mockResolvedValue([1]),
            first: jest.fn(),
            increment: jest.fn().mockReturnThis(),
            decrement: jest.fn().mockReturnThis(),
            forUpdate: jest.fn().mockReturnThis()
        };
        database_1.db.transaction.mockImplementation((callback) => callback(mockTransaction));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('fundWallet', () => {
        const mockFundData = {
            walletId: (0, uuid_1.v4)(),
            amount: 1000.00,
        };
        it('should fund wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            mockTransaction.first.mockResolvedValue({
                id: (0, uuid_1.v4)(),
                balance: 0,
                status: Wallet_1.WalletStatus.ACTIVE
            });
            const result = yield walletService.fundWallet(mockFundData.walletId, mockFundData.amount);
            expect(result).toHaveProperty('newBalance', 1000.00);
            expect(result).toHaveProperty('transactionId');
            expect(mockTransaction.increment).toHaveBeenCalledWith('balance', mockFundData.amount);
            expect(mockTransaction.commit).toHaveBeenCalled();
        }));
        it('should throw error for inactive wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            mockTransaction.first.mockResolvedValue({
                id: (0, uuid_1.v4)(),
                balance: 0,
                userId: mockFundData.walletId,
                status: Wallet_1.WalletStatus.FROZEN
            });
            yield expect(walletService.fundWallet(mockFundData.walletId, mockFundData.amount))
                .rejects
                .toThrow('Wallet is not active');
            expect(mockTransaction.rollback).toHaveBeenCalled();
        }));
        it('should throw error for negative amount', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidData = Object.assign(Object.assign({}, mockFundData), { amount: -100 });
            yield expect(walletService.fundWallet(mockFundData.walletId, mockFundData.amount))
                .rejects
                .toThrow('Invalid amount');
        }));
    });
});
