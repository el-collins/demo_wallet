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
      req.params = { walletId: 'wallet-id' };
      await walletController.fundWallet(req, res);

      expect(walletService.fundWallet).toHaveBeenCalledWith(req.params.walletId, req.body.amount);
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
      try {
        await walletController.fundWallet(req, res);
      } catch (error) {
        // handle error
      }

      expect(walletService.fundWallet).toHaveBeenCalledWith('user-id', 100);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error funding wallet',
        data: null
      });
    });
  });
  jest.mock('../../../services/walletService');

});