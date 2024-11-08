"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWithdrawal = exports.validateTransfer = exports.validateFundWallet = exports.validateCreateWallet = void 0;
const joi_1 = __importDefault(require("joi"));
const response_1 = require("../../utils/response");
const createWalletSchema = joi_1.default.object({
    currency: joi_1.default.string().length(3).default("NGN"),
});
const fundWalletSchema = joi_1.default.object({
    amount: joi_1.default.number().positive().required(),
});
const transferSchema = joi_1.default.object({
    recipientId: joi_1.default.string().uuid().required(),
    amount: joi_1.default.number().positive().required(),
    description: joi_1.default.string().max(100),
});
const withdrawalSchema = joi_1.default.object({
    amount: joi_1.default.number().positive().required(),
});
const validateCreateWallet = (req, res, next) => {
    const { error } = createWalletSchema.validate(req.body);
    if (error) {
        (0, response_1.badRequest)(res, error.details.map((detail) => detail.message).join(", "));
    }
    next();
};
exports.validateCreateWallet = validateCreateWallet;
const validateFundWallet = (req, res, next) => {
    const { error } = fundWalletSchema.validate(req.body);
    if (error) {
        (0, response_1.badRequest)(res, error.details.map((detail) => detail.message).join(", "));
    }
    next();
};
exports.validateFundWallet = validateFundWallet;
const validateTransfer = (req, res, next) => {
    const { error } = transferSchema.validate(req.body);
    if (error) {
        (0, response_1.badRequest)(res, error.details.map((detail) => detail.message).join(", "));
    }
    next();
};
exports.validateTransfer = validateTransfer;
const validateWithdrawal = (req, res, next) => {
    const { error } = withdrawalSchema.validate(req.body);
    if (error) {
        (0, response_1.badRequest)(res, error.details.map((detail) => detail.message).join(", "));
    }
    next();
};
exports.validateWithdrawal = validateWithdrawal;
