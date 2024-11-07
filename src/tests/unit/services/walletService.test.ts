import { WalletService } from '../../../services/walletService';
import { db } from '../../../config/database';
import { WalletStatus } from '../../../models/Wallet';
import { TransactionType, TransactionStatus } from '../../../models/Transaction';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../../config/database');

describe('WalletService', () => {
    let walletService: WalletService;
    let mockTransaction: any;

    beforeEach(() => {
        walletService = new WalletService();
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

        (db.transaction as jest.Mock).mockImplementation((callback) =>
            callback(mockTransaction)
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fundWallet', () => {
        const mockFundData = {
            walletId: uuidv4(),
            amount: 1000.00,
        };

        it('should fund wallet successfully', async () => {
            mockTransaction.first.mockResolvedValue({
                id: uuidv4(),
                balance: 0,
                status: WalletStatus.ACTIVE
            });

            const result = await walletService.fundWallet(mockFundData.walletId, mockFundData.amount);

            expect(result).toHaveProperty('newBalance', 1000.00);
            expect(result).toHaveProperty('transactionId');
            expect(mockTransaction.increment).toHaveBeenCalledWith('balance', mockFundData.amount);
            expect(mockTransaction.commit).toHaveBeenCalled();
        });

        it('should throw error for inactive wallet', async () => {
            mockTransaction.first.mockResolvedValue({
                id: uuidv4(),
                balance: 0,
                userId: mockFundData.walletId,
                status: WalletStatus.FROZEN
            });

            await expect(walletService.fundWallet(mockFundData.walletId, mockFundData.amount))
                .rejects
                .toThrow('Wallet is not active');

            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        it('should throw error for negative amount', async () => {
            const invalidData = { ...mockFundData, amount: -100 };

            await expect(walletService.fundWallet(mockFundData.walletId, mockFundData.amount))
                .rejects
                .toThrow('Invalid amount');
        });


        
    });

});