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
const walletController_1 = require("../../../controllers/walletController");
const walletService_1 = require("../../../services/walletService");
jest.mock('../../../services/walletService');
describe('WalletController', () => {
    let req;
    let res;
    let next;
    let walletController;
    beforeEach(() => {
        req = {
            user: { id: 'user-id', email: 'test@example.com' },
            body: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        walletController = new walletController_1.WalletController();
    });
    describe('createWallet', () => {
        it('should create a wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockWallet = { id: 'wallet-id', userId: 'user-id', balance: 0 };
            walletService_1.walletService.createWallet = jest.fn().mockResolvedValue(mockWallet);
            yield walletController.createWallet(req, res);
            expect(walletService_1.walletService.createWallet).toHaveBeenCalledWith('user-id', 'test@example.com');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'Wallet created successfully',
                data: mockWallet
            });
        }));
        it('should handle errors when creating a wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error creating wallet');
            walletService_1.walletService.createWallet = jest.fn().mockRejectedValue(error);
            yield walletController.createWallet(req, res);
            expect(walletService_1.walletService.createWallet).toHaveBeenCalledWith('user-id', 'test@example.com');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error creating wallet',
                data: null
            });
        }));
    });
    describe('getWallet', () => {
        it('should retrieve a wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockWallet = { id: 'wallet-id', userId: 'user-id', balance: 100 };
            walletService_1.walletService.getWalletByUserId = jest.fn().mockResolvedValue(mockWallet);
            yield walletController.getWallet(req, res);
            expect(walletService_1.walletService.getWalletByUserId).toHaveBeenCalledWith('user-id');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'Wallet retrieved successfully',
                data: mockWallet
            });
        }));
        it('should handle errors when retrieving a wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error retrieving wallet');
            walletService_1.walletService.getWalletByUserId = jest.fn().mockRejectedValue(error);
            yield walletController.getWallet(req, res);
            expect(walletService_1.walletService.getWalletByUserId).toHaveBeenCalledWith('user-id');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Failed to fetch wallet details',
                data: null
            });
        }));
    });
    describe('fundWallet', () => {
        it('should fund a wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTransaction = { id: 'transaction-id', walletId: 'wallet-id', amount: 100 };
            walletService_1.walletService.fundWallet = jest.fn().mockResolvedValue(mockTransaction);
            req.body.amount = 100;
            req.params = { walletId: 'wallet-id' };
            yield walletController.fundWallet(req, res);
            expect(walletService_1.walletService.fundWallet).toHaveBeenCalledWith('wallet-id', 100);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'Wallet funded successfully',
                data: mockTransaction
            });
        }));
        it('should handle errors when funding a wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error funding wallet');
            walletService_1.walletService.fundWallet = jest.fn().mockRejectedValue(error);
            req.body.amount = 100;
            req.params = { walletId: 'wallet-id' };
            yield walletController.fundWallet(req, res);
            expect(walletService_1.walletService.fundWallet).toHaveBeenCalledWith('wallet-id', 100);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error funding wallet',
                data: null
            });
        }));
    });
    describe('transfer', () => {
        it('should transfer funds successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTransaction = { id: 'transaction-id', amount: 100 };
            walletService_1.walletService.transfer = jest.fn().mockResolvedValue(mockTransaction);
            req.body = { recipientId: 'recipient-id', amount: 100 };
            yield walletController.transfer(req, res);
            expect(walletService_1.walletService.transfer).toHaveBeenCalledWith('user-id', 'recipient-id', 100);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'Transfer successful',
                data: mockTransaction
            });
        }));
        it('should handle errors when transferring funds', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error transferring funds');
            walletService_1.walletService.transfer = jest.fn().mockRejectedValue(error);
            req.body = { recipientId: 'recipient-id', amount: 100 };
            yield walletController.transfer(req, res);
            expect(walletService_1.walletService.transfer).toHaveBeenCalledWith('user-id', 'recipient-id', 100);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error transferring funds',
                data: null
            });
        }));
    });
    describe('withdraw', () => {
        it('should withdraw funds successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTransaction = { id: 'transaction-id', amount: 100 };
            walletService_1.walletService.withdraw = jest.fn().mockResolvedValue(mockTransaction);
            req.body.amount = 100;
            yield walletController.withdraw(req, res);
            expect(walletService_1.walletService.withdraw).toHaveBeenCalledWith('user-id', 100);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'Withdrawal initiated successfully',
                data: mockTransaction
            });
        }));
        it('should handle errors when withdrawing funds', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error withdrawing funds');
            walletService_1.walletService.withdraw = jest.fn().mockRejectedValue(error);
            req.body.amount = 100;
            yield walletController.withdraw(req, res);
            expect(walletService_1.walletService.withdraw).toHaveBeenCalledWith('user-id', 100);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error withdrawing funds',
                data: null
            });
        }));
    });
    describe('getTransactions', () => {
        it('should retrieve transactions successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTransactions = [{ id: 'transaction-id', amount: 100 }];
            walletService_1.walletService.getTransactions = jest.fn().mockResolvedValue(mockTransactions);
            req.query = { page: 1, limit: 10, type: 'credit' };
            yield walletController.getTransactions(req, res);
            expect(walletService_1.walletService.getTransactions).toHaveBeenCalledWith('user-id', {
                page: 1,
                limit: 10,
                type: 'credit'
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'Transactions retrieved successfully',
                data: mockTransactions
            });
        }));
        it('should handle errors when retrieving transactions', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error retrieving transactions');
            walletService_1.walletService.getTransactions = jest.fn().mockRejectedValue(error);
            req.query = { page: 1, limit: 10, type: 'credit' };
            yield walletController.getTransactions(req, res);
            expect(walletService_1.walletService.getTransactions).toHaveBeenCalledWith('user-id', {
                page: 1,
                limit: 10,
                type: 'credit'
            });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error retrieving transactions',
                data: null
            });
        }));
    });
    describe('getBalance', () => {
        it('should retrieve balance successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockBalance = 100;
            walletService_1.walletService.getBalance = jest.fn().mockResolvedValue(mockBalance);
            yield walletController.getBalance(req, res);
            expect(walletService_1.walletService.getBalance).toHaveBeenCalledWith('user-id');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'Balance retrieved successfully',
                data: { balance: mockBalance }
            });
        }));
        it('should handle errors when retrieving balance', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error retrieving balance');
            walletService_1.walletService.getBalance = jest.fn().mockRejectedValue(error);
            yield walletController.getBalance(req, res);
            expect(walletService_1.walletService.getBalance).toHaveBeenCalledWith('user-id');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error retrieving balance',
                data: null
            });
        }));
    });
    jest.mock('../../../services/walletService');
});
