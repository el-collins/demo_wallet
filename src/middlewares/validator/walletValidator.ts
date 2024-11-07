import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { badRequest } from "../../utils/response";

const createWalletSchema = Joi.object({
  currency: Joi.string().length(3).default("NGN"),
});

const fundWalletSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

const transferSchema = Joi.object({
  recipientId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().max(100),
});

const withdrawalSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

export const validateCreateWallet = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createWalletSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details.map((detail) => detail.message).join(", "));
  }
  next();
};

export const validateFundWallet = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = fundWalletSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details.map((detail) => detail.message).join(", "));
  }
  next();
};

export const validateTransfer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = transferSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details.map((detail) => detail.message).join(", "));
  }
  next();
};

export const validateWithdrawal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = withdrawalSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details.map((detail) => detail.message).join(", "));
  }
  next();
};
