import { WalletService } from '../../../services/walletService';
import { knex } from '../../../config/database';
import { ValidationError, InsufficientFundsError } from '../../../utils/errors';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../../config/database', () => ({
  knex: {
    transaction: jest.fn(),
    table: jest.fn()
  }
}));

describe('WalletService', () => {
  let walletService: WalletService;
  
  beforeEach(() => {
    walletService = new WalletService();
    jest.clearAllMocks();
  });

  describe('fundWallet', () => {
    const mockFundData = {
      userId: uuidv4(),
      amount: 1000.00,
      reference: uuidv4()
    };

    it('should fund wallet successfully', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        table: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1),
        insert: jest.fn().mockResolvedValue([1]),
        first: jest.fn().mockResolvedValue({ 
          id: uuidv4(), 
          balance: 0, 
          userId: mockFundData.userId 
        })
      };

      (knex.transaction as jest.Mock).mockImplementation((callback) => 
        callback(mockTransaction)
      );

      const result = await walletService.fundWallet(mockFundData);

      expect(result).toHaveProperty('newBalance', 1000.00);
      expect(result).toHaveProperty('transactionId');
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw error for duplicate transaction reference', async () => {
      const mockTransaction = {
        table: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: 'existing-transaction' })
      };

      (knex.transaction as jest.Mock).mockImplementation((callback) => 
        callback(mockTransaction)
      );

      await expect(walletService.fundWallet(mockFundData))
        .rejects
        .toThrow('Duplicate transaction reference');
    });
  });

  describe('transfer', () => {
    const mockTransferData = {
      fromUserId: uuidv4(),
      toUserId: uuidv4(),
      amount: 500.00,
      reference: uuidv4()
    };

    it('should transfer funds successfully', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        table: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1),
        insert: jest.fn().mockResolvedValue([1]),
        first: jest.fn()
          .mockResolvedValueOnce({ id: uuidv4(), balance: 1000.00 }) // sender wallet
          .mockResolvedValueOnce({ id: uuidv4(), balance: 0 }) // receiver wallet
      };

      (knex.transaction as jest.Mock).mockImplementation((callback) => 
        callback(mockTransaction)
      );

      const result = await walletService.transfer(mockTransferData);

      expect(result).toHaveProperty('transactionId');
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw error for insufficient funds', async () => {
      const mockTransaction = {
        table: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: uuidv4(), balance: 100.00 })
      };

      (knex.transaction as jest.Mock).mockImplementation((callback) => 
        callback(mockTransaction)
      );

      await expect(walletService.transfer(mockTransferData))
        .rejects
        .toThrow(InsufficientFundsError);
    });
  });

  describe('withdraw', () => {
    const mockWithdrawData = {
      userId: uuidv4(),
      amount: 500.00,
      reference: uuidv4()
    };

    it('should process withdrawal successfully', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        table: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1),
        insert: jest.fn().mockResolvedValue([1]),
        first: jest.fn().mockResolvedValue({ 
          id: uuidv4(), 
          balance: 1000.00 
        })
      };

      (knex.transaction as jest.Mock).mockImplementation((callback) => 
        callback(mockTransaction)
      );

      const result = await walletService.withdraw(mockWithdrawData);

      expect(result).toHaveProperty('newBalance', 500.00);
      expect(result).toHaveProperty('transactionId');
      expect(mockTransaction.commit).toHaveBeenCalled();
    });
  });
});