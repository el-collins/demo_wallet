// src/controllers/walletController.ts
import { Request, Response } from "express";
import { walletService } from "../services/walletService";
import logger from "../utils/logger";
import {
  badRequest,
  forbidden,
  handleError,
  handleResponse,
  notFound,
  serverError,
  success,
} from "../utils/response";

export class WalletController {
  createWallet = async (req: any, res: any) => {
    try {
      const { id, email } = req.user;

      const wallet = await walletService.createWallet(id, email);

      handleResponse(res, 201, "Wallet created successfully", wallet);
    } catch (error: any) {
      logger.error("Error creating wallet:", error);

      if (error.message === "User is blacklisted from the platform") {
        forbidden(res, error.message);
      }

      handleError(res, error);
    }
  };

  getWallet = async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        forbidden(res, "User ID is required");
      }

      const wallet = await walletService.getWalletByUserId(userId);

      if (!wallet) {
        notFound(res, "Wallet not found");
      }

      success(res, "Wallet retrieved successfully", wallet);
    } catch (error: any) {
      logger.error("Error fetching wallet:", error);
      serverError(res, "Failed to fetch wallet details");
    }
  };

  getAllWallets = async (req: any, res: Response) => {
    try {
      const wallets = await walletService.getAllWallets();

      success(res, "Wallets retrieved successfully", wallets);
    } catch (error: any) {
      logger.error("Error fetching wallets:", error);
      serverError(res, "Failed to fetch wallets");
    }
  };

  fundWallet = async (req: any, res: Response) => {
    try {
      const { amount } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        forbidden(res, "User ID is required");
      }

      const { id } = await walletService.getWalletByUserId(userId);

      const transaction = await walletService.fundWallet(id, amount);

      handleResponse(res, 200, "Wallet funded successfully", {
        transaction,
      });
    } catch (error: any) {
      logger.error("Error funding wallet:", error);

      if (error.message === "Wallet not found") {
        notFound(res, "Wallet not found");
      }

      if (error.message === "Wallet is not active") {
        badRequest(res, "Wallet is not in active status");
      }

      handleError(res, "Failed to fund wallet");
    }
  };

  transfer = async (req: any, res: Response) => {
    try {
      const { recipientId, amount } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        forbidden(res, "User ID is required");
      }

      const { id: senderWalletId } = await walletService.getWalletByUserId(
        userId
      );

      const { id: receiverWalletId } = await walletService.getWalletByUserId(
        recipientId
      );
      console.log(receiverWalletId);

      const transaction = await walletService.transfer(
        senderWalletId,
        receiverWalletId,
        amount
      );

      handleResponse(res, 200, "Transfer successful", transaction);
    } catch (error: any) {
      logger.error("Error transferring funds:", error);

      if (error.message === "Insufficient funds") {
        badRequest(res, "Insufficient funds for transfer");
      }

      if (error.message === "Invalid wallet details") {
        notFound(res, "Invalid recipient details");
      }

      serverError(res, "Failed to process transfer");
    }
  };

  withdraw = async (req: any, res: Response) => {
    try {
      const { amount } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        forbidden(res, "User ID is required");
      }

      const { id: walletId } = await walletService.getWalletByUserId(userId);

      const transaction = await walletService.withdraw(walletId, amount);

      handleResponse(
        res,
        200,
        "Withdrawal initiated successfully",
        transaction
      );
    } catch (error: any) {
      logger.error("Error processing withdrawal:", error);

      if (error.message === "Insufficient funds") {
        badRequest(res, "Insufficient funds for withdrawal");
      }

      serverError(res, "Failed to process withdrawal");
    }
  };

  getTransactions = async (req: any, res: Response) => {
    try {
      const { page, limit, type } = req.query;
      const userId = req.user?.id;


      const { id: walletId } = await walletService.getWalletByUserId(userId);

      const transactions = await walletService.getTransactions(walletId, {
        page: Number(page),
        limit: Number(limit),
        type: type as string,
      });

      handleResponse(res, 200, "Transactions retrieved successfully", transactions);
    } catch (error: any) {
      logger.error("Error fetching transactions:", error);
      handleError(res, "Failed to fetch transactions");
    }
  };

  getBalance = async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;

      const { id: walletId } = await walletService.getWalletByUserId(userId);

      const balance = await walletService.getBalance(walletId);

      handleResponse(res, 200, "Balance retrieved successfully", { balance });
    } catch (error: any) {
      logger.error("Error fetching balance:", error);
      handleError(res, "Failed to fetch wallet balance");
    }
  };


}

export const walletController = new WalletController();
