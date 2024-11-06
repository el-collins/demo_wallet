import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AdjutorService } from './adjutorService';
import { Wallet, WalletStatus } from '../models/Wallet';
import { Transaction, TransactionStatus, TransactionType } from '../models/Transaction';


class WalletService {
  private adjutorService: AdjutorService;

  constructor() {
    this.adjutorService = AdjutorService.getInstance();
  }

  async createWallet(userId: string): Promise<Wallet> {
    const trx = await db.transaction();
    
    try {
      // Check blacklist
      const isBlacklisted = await this.adjutorService.checkKarmaBlacklist(userId);
      if (isBlacklisted) {
        throw new Error('User is blacklisted from the platform');
      }

      const wallet: Wallet = {
        id: uuidv4(),
        userId,
        balance: 0,
        status: WalletStatus.ACTIVE,
        currency: 'NGN',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await trx('wallets').insert(wallet);
      await trx.commit();
      
      return wallet;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async fundWallet(walletId: string, amount: number): Promise<Transaction> {
    const trx = await db.transaction();
    
    try {
      const wallet = await trx('wallets')
        .where('id', walletId)
        .first();

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.status !== 'active') {
        throw new Error('Wallet is not active');
      }

      const transaction: Transaction = {
        id: uuidv4(),
        walletId,
        type: TransactionType.FUNDING,
        amount,
        currency: wallet.currency,
        status: TransactionStatus.PENDING,
        reference: `FUND-${uuidv4()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await trx('transactions').insert(transaction);
      await trx('wallets')
        .where('id', walletId)
        .increment('balance', amount)
        .update('updatedAt', new Date());

      transaction.status = TransactionStatus.COMPLETED,

      await trx('transactions')
        .where('id', transaction.id)
        .update('status', 'completed');

      await trx.commit();
      return transaction;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async transfer(
    senderWalletId: string,
    receiverWalletId: string,
    amount: number
  ): Promise<Transaction> {
    const trx = await db.transaction();
    
    try {
      const [senderWallet, receiverWallet] = await Promise.all([
        trx('wallets').where('id', senderWalletId).first(),
        trx('wallets').where('id', receiverWalletId).first()
      ]);

      if (!senderWallet || !receiverWallet) {
        throw new Error('Invalid wallet details');
      }

      if (senderWallet.balance < amount) {
        throw new Error('Insufficient funds');
      }

      const transaction: Transaction = {
        id: uuidv4(),
        walletId: senderWalletId,
        type: TransactionType.TRANSFER,
        amount,
        currency: senderWallet.currency,
        status: TransactionStatus.PENDING,
        reference: `TRF-${uuidv4()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await Promise.all([
        trx('transactions').insert(transaction),
        trx('wallets')
          .where('id', senderWalletId)
          .decrement('balance', amount),
        trx('wallets')
          .where('id', receiverWalletId)
          .increment('balance', amount)
      ]);

      transaction.status = TransactionStatus.COMPLETED,
      await trx('transactions')
        .where('id', transaction.id)
        .update('status', 'completed');

      await trx.commit();
      return transaction;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

export const walletService = new WalletService();