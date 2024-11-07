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
const walletController_1 = require("../../src/controllers/walletController");
const walletService_1 = require("../../src/services/walletService");
jest.mock('../../src/services/walletService');
jest.mock('../../src/utils/logger');
describe('WalletController', () => {
    let mockRequest;
    let mockResponse;
    let walletController;
    beforeEach(() => {
        mockRequest = {
            user: { id: 'test-user-id', email: 'test@example.com' },
            body: {},
            query: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        walletController = new walletController_1.WalletController();
    });
    describe('createWallet', () => {
        it('should create wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock service
            const mockWallet = { id: 'new-wallet-id', balance: 0 };
            walletService_1.walletService.createWallet.mockResolvedValue(mockWallet);
            // Execute
            yield walletController.createWallet(mockRequest, mockResponse);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Wallet created successfully',
                data: mockWallet,
            });
        }));
        it('should handle blacklisted user error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock service error
            walletService_1.walletService.createWallet.mockRejectedValue(new Error('User is blacklisted from the platform'));
            // Execute
            yield walletController.createWallet(mockRequest, mockResponse);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'User is blacklisted from the platform',
            });
        }));
    });
    describe('getWallet', () => {
        it('should return wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock service
            const mockWallet = { id: 'wallet-id', balance: 100 };
            walletService_1.walletService.getWalletByUserId.mockResolvedValue(mockWallet);
            // Execute
            yield walletController.getWallet(mockRequest, mockResponse);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Wallet retrieved successfully',
                data: mockWallet,
            });
        }));
        it('should handle wallet not found error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock service error
            walletService_1.walletService.getWalletByUserId.mockResolvedValue(null);
            // Execute
            yield walletController.getWallet(mockRequest, mockResponse);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            jest.mock('../../src/services/walletService');
            jest.mock('../../src/utils/logger');
            describe('WalletController', () => {
                let mockRequest;
                let mockResponse;
                let walletController;
                beforeEach(() => {
                    mockRequest = {
                        user: { id: 'test-user-id', email: 'test@example.com' },
                        body: {},
                        query: {},
                    };
                    mockResponse = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn(),
                    };
                    walletController = new walletController_1.WalletController();
                });
                describe('createWallet', () => {
                    it('should create wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                        const mockWallet = { id: 'new-wallet-id', balance: 0 };
                        walletService_1.walletService.createWallet.mockResolvedValue(mockWallet);
                        yield walletController.createWallet(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(201);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'success',
                            message: 'Wallet created successfully',
                            data: mockWallet,
                        });
                    }));
                    it('should handle blacklisted user error', () => __awaiter(void 0, void 0, void 0, function* () {
                        walletService_1.walletService.createWallet.mockRejectedValue(new Error('User is blacklisted from the platform'));
                        yield walletController.createWallet(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(403);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: 'User is blacklisted from the platform',
                        });
                    }));
                });
                describe('getWallet', () => {
                    it('should return wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                        const mockWallet = { id: 'wallet-id', balance: 100 };
                        walletService_1.walletService.getWalletByUserId.mockResolvedValue(mockWallet);
                        yield walletController.getWallet(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(200);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'success',
                            message: 'Wallet retrieved successfully',
                            data: mockWallet,
                        });
                    }));
                    it('should handle wallet not found error', () => __awaiter(void 0, void 0, void 0, function* () {
                        walletService_1.walletService.getWalletByUserId.mockResolvedValue(null);
                        yield walletController.getWallet(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(404);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: 'Wallet not found',
                        });
                    }));
                });
                describe('getAllWallets', () => {
                    it('should return all wallets successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                        const mockWallets = [{ id: 'wallet-1', balance: 100 }, { id: 'wallet-2', balance: 200 }];
                        walletService_1.walletService.getAllWallets.mockResolvedValue(mockWallets);
                        yield walletController.getAllWallets(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(200);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'success',
                            message: 'Wallets retrieved successfully',
                            data: mockWallets,
                        });
                    }));
                    it('should handle error when fetching wallets', () => __awaiter(void 0, void 0, void 0, function* () {
                        walletService_1.walletService.getAllWallets.mockRejectedValue(new Error('Failed to fetch wallets'));
                        yield walletController.getAllWallets(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(500);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: 'Failed to fetch wallets',
                        });
                    }));
                });
                describe('fundWallet', () => {
                    it('should fund wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                        const mockTransaction = { id: 'transaction-id', amount: 100 };
                        walletService_1.walletService.fundWallet.mockResolvedValue(mockTransaction);
                        jest.mock('../../src/services/walletService');
                        mockRequest.body = { amount: 100 };
                        yield walletController.fundWallet(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(200);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'success',
                            message: 'Wallet funded successfully',
                            data: mockTransaction,
                        });
                    }));
                    it('should handle wallet not found error', () => __awaiter(void 0, void 0, void 0, function* () {
                        walletService_1.walletService.fundWallet.mockRejectedValue(new Error('Wallet not found'));
                        mockRequest.body = { amount: 100 };
                        yield walletController.fundWallet(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(404);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: 'Wallet not found',
                        });
                    }));
                });
                describe('transfer', () => {
                    it('should transfer funds successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                        const mockTransaction = { id: 'transaction-id', amount: 100 };
                        walletService_1.walletService.transfer.mockResolvedValue(mockTransaction);
                        mockRequest.body = { recipientId: 'recipient-wallet-id', amount: 100 };
                        yield walletController.transfer(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(200);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'success',
                            message: 'Transfer successful',
                            data: mockTransaction,
                        });
                    }));
                    it('should handle insufficient funds error', () => __awaiter(void 0, void 0, void 0, function* () {
                        walletService_1.walletService.transfer.mockRejectedValue(new Error('Insufficient funds'));
                        mockRequest.body = { recipientId: 'recipient-wallet-id', amount: 100 };
                        yield walletController.transfer(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(400);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: 'Insufficient funds',
                        });
                    }));
                });
                describe('withdraw', () => {
                    it('should withdraw funds successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                        const mockTransaction = { id: 'transaction-id', amount: 100 };
                        walletService_1.walletService.withdraw.mockResolvedValue(mockTransaction);
                        mockRequest.body = { amount: 100 };
                        yield walletController.withdraw(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(200);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'success',
                            message: 'Withdrawal successful',
                            data: mockTransaction,
                        });
                    }));
                    it('should handle insufficient funds error', () => __awaiter(void 0, void 0, void 0, function* () {
                        walletService_1.walletService.withdraw.mockRejectedValue(new Error('Insufficient funds'));
                        mockRequest.body = { amount: 100 };
                        yield walletController.withdraw(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(400);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: 'Insufficient funds',
                        });
                    }));
                });
                describe('getTransactions', () => {
                    it('should return transactions successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                        const mockTransactions = [{ id: 'transaction-1', amount: 100 }, { id: 'transaction-2', amount: 200 }];
                        walletService_1.walletService.getTransactions.mockResolvedValue(mockTransactions);
                        mockRequest.query = { page: '1', limit: '10', type: 'deposit' };
                        yield walletController.getTransactions(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(200);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'success',
                            message: 'Transactions retrieved successfully',
                            data: mockTransactions,
                        });
                    }));
                    it('should handle error when fetching transactions', () => __awaiter(void 0, void 0, void 0, function* () {
                        walletService_1.walletService.getTransactions.mockRejectedValue(new Error('Failed to fetch transactions'));
                        mockRequest.query = { page: '1', limit: '10', type: 'deposit' };
                        yield walletController.getTransactions(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(500);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: 'Failed to fetch transactions',
                        });
                    }));
                });
                describe('getBalance', () => {
                    it('should return balance successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                        const mockBalance = 100;
                        walletService_1.walletService.getBalance.mockResolvedValue(mockBalance);
                        yield walletController.getBalance(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(200);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'success',
                            message: 'Balance retrieved successfully',
                            data: { balance: mockBalance },
                        });
                    }));
                    it('should handle error when fetching balance', () => __awaiter(void 0, void 0, void 0, function* () {
                        walletService_1.walletService.getBalance.mockRejectedValue(new Error('Failed to fetch wallet balance'));
                        yield walletController.getBalance(mockRequest, mockResponse);
                        expect(mockResponse.status).toHaveBeenCalledWith(500);
                        expect(mockResponse.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: 'Failed to fetch wallet balance',
                        });
                    }));
                });
            });
        }));
        it('should handle wallet not found error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock service error
            walletService_1.walletService.fundWallet.mockRejectedValue(new Error('Wallet not found'));
            // Set request body
            mockRequest.body = { amount: 100 };
            // Execute
            yield walletController.fundWallet(mockRequest, mockResponse);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Wallet not found',
            });
        }));
    });
    describe('transfer', () => {
        it('should transfer funds successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock service
            const mockTransaction = { id: 'transaction-id', amount: 100 };
            walletService_1.walletService.transfer.mockResolvedValue(mockTransaction);
            // Set request body
            mockRequest.body = { recipientId: 'recipient-wallet-id', amount: 100 };
            // Execute
            yield walletController.transfer(mockRequest, mockResponse);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Transfer successful',
                data: mockTransaction,
            });
        }));
        it('should handle insufficient funds error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock service error
            walletService_1.walletService.transfer.mockRejectedValue(new Error('Insufficient funds'));
            // Set request body
            mockRequest.body = { recipientId: 'recipient-wallet-id', amount: 100 };
            // Execute
            yield walletController.transfer(mockRequest, mockResponse);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Insufficient funds',
            });
        }));
    });
    describe('withdraw', () => {
        it('should withdraw funds successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock service
            const mockTransaction = { id: 'transaction-id', amount: 100 };
            walletService_1.walletService.withdraw.mockResolvedValue(mockTransaction);
            // Set request body
            mockRequest.body = { amount: 100 };
            // Execute
            yield walletController.withdraw(mockRequest, mockResponse);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Withdrawal successful',
                data: mockTransaction,
            });
        }));
        it('should handle insufficient funds error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock service error
            walletService_1.walletService.withdraw.mockRejectedValue(new Error('Insufficient funds'));
            // Set request body
            mockRequest.body = { amount: 100 };
            // Execute
            yield walletController.withdraw(mockRequest, mockResponse);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Insufficient funds',
            });
        }));
    });
});
