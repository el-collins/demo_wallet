import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../../utils/apiResponse';

const createWalletSchema = Joi.object({
  currency: Joi.string().length(3).default('NGN')
});

const fundWalletSchema = Joi.object({
  amount: Joi.number().positive().required()
});

const transferSchema = Joi.object({
  recipientId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().max(100)
});

const withdrawalSchema = Joi.object({
  amount: Joi.number().positive().required(),
  bankDetails: Joi.object({
    bankCode: Joi.string().required(),
    accountNumber: Joi.string().length(10).required(),
    accountName: Joi.string().required()
  }).required()
});

export const validateCreateWallet = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createWalletSchema.validate(req.body);
  if (error) {
    return ApiResponse.badRequest(res, {
      message: error.details[0].message
    });
  }
  next();
};

export const validateFundWallet = (req: Request, res: Response, next: NextFunction) => {
  const { error } = fundWalletSchema.validate(req.body);
  if (error) {
    return ApiResponse.badRequest(res, {
      message: error.details[0].message
    });
  }
  next();
};

export const validateTransfer = (req: Request, res: Response, next: NextFunction) => {
  const { error } = transferSchema.validate(req.body);
  if (error) {
    return ApiResponse.badRequest(res, {
      message: error.details[0].message
    });
  }
  next();
};

export const validateWithdrawal = (req: Request, res: Response, next: NextFunction) => {
  const { error } = withdrawalSchema.validate(req.body);
  if (error) {
    return ApiResponse.badRequest(res, {
      message: error.details[0].message
    });
  }
  next();
};
