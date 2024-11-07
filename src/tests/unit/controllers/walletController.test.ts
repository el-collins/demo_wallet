import { WalletController } from '../../../controllers/walletController';
import { walletService } from '../../../services/walletService';
import { Request, Response } from 'express';

jest.mock('../../../services/walletService');

describe('WalletController', () => {
  let req: any;
  let res: any;
  let next: any;
  let walletController: WalletController;

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
    walletController = new WalletController();
  });

  describe('createWallet', () => {
    it('should create a wallet successfully', async () => {
      const mockWallet = { id: 'wallet-id', userId: 'user-id', balance: 0 };
      walletService.createWallet = jest.fn().mockResolvedValue(mockWallet);

      await walletController.createWallet(req, res);

      expect(walletService.createWallet).toHaveBeenCalledWith('user-id', 'test@example.com');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Wallet created successfully',
        data: mockWallet
      });
    });

    it('should handle errors when creating a wallet', async () => {
      const error = new Error('Error creating wallet');
      walletService.createWallet = jest.fn().mockRejectedValue(error);

      await walletController.createWallet(req, res);

      expect(walletService.createWallet).toHaveBeenCalledWith('user-id', 'test@example.com');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error creating wallet',
        data: null
      });
    });
  });

  describe('getWallet', () => {
    it('should retrieve a wallet successfully', async () => {
      const mockWallet = { id: 'wallet-id', userId: 'user-id', balance: 100 };
      walletService.getWalletByUserId = jest.fn().mockResolvedValue(mockWallet);

      await walletController.getWallet(req, res);

      expect(walletService.getWalletByUserId).toHaveBeenCalledWith('user-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Wallet retrieved successfully',
        data: mockWallet
      });
    });

    it('should handle errors when retrieving a wallet', async () => {
      const error = new Error('Error retrieving wallet');
      walletService.getWalletByUserId = jest.fn().mockRejectedValue(error);

      await walletController.getWallet(req, res);

      expect(walletService.getWalletByUserId).toHaveBeenCalledWith('user-id');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Failed to fetch wallet details',
        data: null
      });
    });
  });

  describe('fundWallet', () => {
    it('should fund a wallet successfully', async () => {
      const mockTransaction = { id: 'transaction-id', walletId: 'wallet-id', amount: 100 };
      walletService.fundWallet = jest.fn().mockResolvedValue(mockTransaction);

      req.body.amount = 100;
      req.params = { walletId: 'wallet-id' };
      await walletController.fundWallet(req, res);

      expect(walletService.fundWallet).toHaveBeenCalledWith('wallet-id', 100);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Wallet funded successfully',
        data: mockTransaction
      });
    });

    it('should handle errors when funding a wallet', async () => {
      const error = new Error('Error funding wallet');
      walletService.fundWallet = jest.fn().mockRejectedValue(error);

      req.body.amount = 100;
      req.params = { walletId: 'wallet-id' };
      await walletController.fundWallet(req, res);

      expect(walletService.fundWallet).toHaveBeenCalledWith('wallet-id', 100);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error funding wallet',
        data: null
      });
    });
  });

  describe('transfer', () => {
    it('should transfer funds successfully', async () => {
      const mockTransaction = { id: 'transaction-id', amount: 100 };
      walletService.transfer = jest.fn().mockResolvedValue(mockTransaction);

      req.body = { recipientId: 'recipient-id', amount: 100 };
      await walletController.transfer(req, res);

      expect(walletService.transfer).toHaveBeenCalledWith('user-id', 'recipient-id', 100);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Transfer successful',
        data: mockTransaction
      });
    });

    it('should handle errors when transferring funds', async () => {
      const error = new Error('Error transferring funds');
      walletService.transfer = jest.fn().mockRejectedValue(error);

      req.body = { recipientId: 'recipient-id', amount: 100 };
      await walletController.transfer(req, res);

      expect(walletService.transfer).toHaveBeenCalledWith('user-id', 'recipient-id', 100);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error transferring funds',
        data: null
      });
    });
  });

  describe('withdraw', () => {
    it('should withdraw funds successfully', async () => {
      const mockTransaction = { id: 'transaction-id', amount: 100 };
      walletService.withdraw = jest.fn().mockResolvedValue(mockTransaction);

      req.body.amount = 100;
      await walletController.withdraw(req, res);

      expect(walletService.withdraw).toHaveBeenCalledWith('user-id', 100);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Withdrawal initiated successfully',
        data: mockTransaction
      });
    });

    it('should handle errors when withdrawing funds', async () => {
      const error = new Error('Error withdrawing funds');
      walletService.withdraw = jest.fn().mockRejectedValue(error);

      req.body.amount = 100;
      await walletController.withdraw(req, res);

      expect(walletService.withdraw).toHaveBeenCalledWith('user-id', 100);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error withdrawing funds',
        data: null
      });
    });
  });

  describe('getTransactions', () => {
    it('should retrieve transactions successfully', async () => {
      const mockTransactions = [{ id: 'transaction-id', amount: 100 }];
      walletService.getTransactions = jest.fn().mockResolvedValue(mockTransactions);

      req.query = { page: 1, limit: 10, type: 'credit' };
      await walletController.getTransactions(req, res);

      expect(walletService.getTransactions).toHaveBeenCalledWith('user-id', {
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
    });

    it('should handle errors when retrieving transactions', async () => {
      const error = new Error('Error retrieving transactions');
      walletService.getTransactions = jest.fn().mockRejectedValue(error);

      req.query = { page: 1, limit: 10, type: 'credit' };
      await walletController.getTransactions(req, res);

      expect(walletService.getTransactions).toHaveBeenCalledWith('user-id', {
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
    });
  });

  describe('getBalance', () => {
    it('should retrieve balance successfully', async () => {
      const mockBalance = 100;
      walletService.getBalance = jest.fn().mockResolvedValue(mockBalance);

      await walletController.getBalance(req, res);

      expect(walletService.getBalance).toHaveBeenCalledWith('user-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Balance retrieved successfully',
        data: { balance: mockBalance }
      });
    });

    it('should handle errors when retrieving balance', async () => {
      const error = new Error('Error retrieving balance');
      walletService.getBalance = jest.fn().mockRejectedValue(error);

      await walletController.getBalance(req, res);

      expect(walletService.getBalance).toHaveBeenCalledWith('user-id');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error retrieving balance',
        data: null
      });
    });
  });
  jest.mock('../../../services/walletService');

});