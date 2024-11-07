// src/services/walletService.ts
import { db } from "../config/database";
import { v4 as uuidv4 } from "uuid";
import { AdjutorService } from "./adjutorService";
import { Wallet, WalletStatus } from "../models/Wallet";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../models/Transaction";

export class WalletService {
  private adjutorService: AdjutorService;

  constructor() {
    this.adjutorService = AdjutorService.getInstance();
  }

  async createWallet(userId: string, email: string, trx?: any): Promise<Wallet> {
    try {
      // Check blacklist
      const isBlacklisted = await this.adjutorService.checkKarmaBlacklist(
        email
      );

      if (isBlacklisted) {
        throw new Error("User is blacklisted from the platform");
      }

      const existingWallet = await trx("wallets")
        .where("userId", userId)
        .first();
      if (existingWallet) {
        throw new Error("Wallet already exists for this user");
      }

      const wallet: Wallet = {
        id: uuidv4(),
        userId,
        balance: 0,
        status: WalletStatus.ACTIVE,
        currency: "NGN",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await trx("wallets").insert(wallet);
      return wallet;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async getWalletByUserId(userId: string) {
    try {
      const wallet = await db("wallets").where("userId", userId).first();

      return wallet;
    } catch (error) {
      throw error;
    }
  }

  async getBalance(walletId: string): Promise<number> {
    const wallet = await db("wallets").where("id", walletId).first();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    return wallet.balance;
  }

  async getAllWallets() {
    return await db("wallets").select("*");
  }

  async fundWallet(walletId: string, amount: number): Promise<Transaction> {
    const trx = await db.transaction();

    try {
      // Lock the wallet row
      const wallet = await trx("wallets")
        .where({ id: walletId, status: WalletStatus.ACTIVE })
        .forUpdate()
        .first();

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const transaction: Transaction = {
        id: uuidv4(),
        walletId,
        type: TransactionType.FUNDING,
        amount,
        status: TransactionStatus.PENDING,
        reference: `FUND-${uuidv4()}-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await trx("transactions").insert(transaction);
      await trx("wallets")
        .where("id", walletId)
        .increment("balance", amount)
        .update("updatedAt", new Date());

      (transaction.status = TransactionStatus.COMPLETED),
        await trx("transactions")
          .where("id", transaction.id)
          .update("status", "completed");

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
        trx("wallets").where("id", senderWalletId).first(),
        trx("wallets").where("id", receiverWalletId).first(),
      ]);

      if (!senderWallet) {
        throw new Error("Invalid sender wallet details");
      }

      if (!receiverWallet) {
        throw new Error("Invalid Receiver wallet details");
      }

      if (senderWallet.balance < amount) {
        throw new Error("Insufficient funds");
      }

      const transaction: Transaction = {
        id: uuidv4(),
        walletId: senderWalletId,
        type: TransactionType.TRANSFER,
        amount,
        status: TransactionStatus.PENDING,
        reference: `TRF-${uuidv4()}-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Promise.all([
        trx("transactions").insert(transaction),
        trx("wallets").where("id", senderWalletId).decrement("balance", amount),
        trx("wallets")
          .where("id", receiverWalletId)
          .increment("balance", amount),
      ]);

      (transaction.status = TransactionStatus.COMPLETED),
        await trx("transactions")
          .where("id", transaction.id)
          .update("status", "completed");

      await trx.commit();
      return transaction;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
  async withdraw(walletId: string, amount: number): Promise<Transaction> {
    return await db.transaction(async (trx) => {
      const wallet = await trx("wallets")
        .where({ id: walletId, status: WalletStatus.ACTIVE })
        .forUpdate()
        .first();

      if (!wallet) {
        throw new Error("Wallet not found or inactive");
      }

      // check if amount is a positive number
      if (amount <= 0) {
        throw new Error("Invalid amount");
      }

      // check if amount is a negative number
      if (amount < 0) {
        throw new Error("Invalid amount");
      }

      if (wallet.balance < amount) {
        throw new Error("Insufficient funds");
      }

      const transaction: Transaction = {
        id: uuidv4(),
        walletId,
        type: TransactionType.WITHDRAWAL,
        amount,
        status: TransactionStatus.COMPLETED,
        reference: `WTH-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Promise.all([
        trx("transactions").insert(transaction),
        trx("wallets")
          .where({ id: walletId })
          .update({
            balance: db.raw("balance - ?", [amount]),
            updatedAt: new Date(),
          }),
      ]);

      return transaction;
    });
  }

  async getTransactions(
    walletId: string,
    options: { page: number; limit: number; type?: string }
  ) {
    const { page, limit, type } = options;

    const query = db("transactions")
      .where("walletId", walletId)
      .orderBy("createdAt", "desc")
      .offset((page - 1) * limit)
      .limit(limit);

    if (type) {
      query.andWhere("type", type);
    }

    const transactions = await query;

    console.log(transactions);

    return transactions;
  }
}

export const walletService = new WalletService();
