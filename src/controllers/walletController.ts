import { Request, Response } from 'express';
import { WalletService } from '../services/walletService';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  createWallet = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const wallet = await this.walletService.createWallet(userId);
      
      return ApiResponse.success(res, {
        message: 'Wallet created successfully',
        data: wallet
      });
    } catch (error: any) {
      logger.error('Error creating wallet:', error);
      
      if (error.message === 'User is blacklisted from the platform') {
        return ApiResponse.forbidden(res, {
          message: 'Unable to create wallet due to platform restrictions'
        });
      }
      
      return ApiResponse.serverError(res, {
        message: 'Failed to create wallet'
      });
    }
  };

  getWallet = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const wallet = await this.walletService.getWalletByUserId(userId);
      
      if (!wallet) {
        return ApiResponse.notFound(res, {
          message: 'Wallet not found'
        });
      }
      
      return ApiResponse.success(res, {
        data: wallet
      });
    } catch (error) {
      logger.error('Error fetching wallet:', error);
      return ApiResponse.serverError(res, {
        message: 'Failed to fetch wallet details'
      });
    }
  };

  fundWallet = async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      const { walletId } = await this.walletService.getWalletByUserId(req.user.id);
      
      const transaction = await this.walletService.fundWallet(walletId, amount);
      
      return ApiResponse.success(res, {
        message: 'Wallet funded successfully',
        data: {
          transaction,
          reference: transaction.reference
        }
      });
    } catch (error: any) {
      logger.error('Error funding wallet:', error);
      
      if (error.message === 'Wallet not found') {
        return ApiResponse.notFound(res, {
          message: 'Wallet not found'
        });
      }
      
      if (error.message === 'Wallet is not active') {
        return ApiResponse.badRequest(res, {
          message: 'Wallet is not in active status'
        });
      }
      
      return ApiResponse.serverError(res, {
        message: 'Failed to fund wallet'
      });
    }
  };

  transfer = async (req: Request, res: Response) => {
    try {
      const { recipientId, amount } = req.body;
      const { walletId: senderWalletId } = await this.walletService.getWalletByUserId(req.user.id);
      const { walletId: receiverWalletId } = await this.walletService.getWalletByUserId(recipientId);
      
      const transaction = await this.walletService.transfer(
        senderWalletId,
        receiverWalletId,
        amount
      );
      
      return ApiResponse.success(res, {
        message: 'Transfer successful',
        data: {
          transaction,
          reference: transaction.reference
        }
      });
    } catch (error: any) {
      logger.error('Error transferring funds:', error);
      
      if (error.message === 'Insufficient funds') {
        return ApiResponse.badRequest(res, {
          message: 'Insufficient funds for transfer'
        });
      }
      
      if (error.message === 'Invalid wallet details') {
        return ApiResponse.notFound(res, {
          message: 'Invalid recipient details'
        });
      }
      
      return ApiResponse.serverError(res, {
        message: 'Failed to process transfer'
      });
    }
  };

  withdraw = async (req: Request, res: Response) => {
    try {
      const { amount, bankDetails } = req.body;
      const { walletId } = await this.walletService.getWalletByUserId(req.user.id);
      
      const transaction = await this.walletService.withdraw(walletId, amount, bankDetails);
      
      return ApiResponse.success(res, {
        message: 'Withdrawal initiated successfully',
        data: {
          transaction,
          reference: transaction.reference
        }
      });
    } catch (error: any) {
      logger.error('Error processing withdrawal:', error);
      
      if (error.message === 'Insufficient funds') {
        return ApiResponse.badRequest(res, {
          message: 'Insufficient funds for withdrawal'
        });
      }
      
      return ApiResponse.serverError(res, {
        message: 'Failed to process withdrawal'
      });
    }
  };

  getTransactions = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, type } = req.query;
      const { walletId } = await this.walletService.getWalletByUserId(req.user.id);
      
      const transactions = await this.walletService.getTransactions(
        walletId,
        {
          page: Number(page),
          limit: Number(limit),
          type: type as string
        }
      );
      
      return ApiResponse.success(res, {
        data: transactions
      });
    } catch (error) {
      logger.error('Error fetching transactions:', error);
      return ApiResponse.serverError(res, {
        message: 'Failed to fetch transactions'
      });
    }
  };

  getBalance = async (req: Request, res: Response) => {
    try {
      const { walletId } = await this.walletService.getWalletByUserId(req.user.id);
      const balance = await this.walletService.getBalance(walletId);
      
      return ApiResponse.success(res, {
        data: { balance }
      });
    } catch (error) {
      logger.error('Error fetching balance:', error);
      return ApiResponse.serverError(res, {
        message: 'Failed to fetch wallet balance'
      });
    }
  };
}