"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateCreateUser = void 0;
const joi_1 = __importDefault(require("joi"));
// Custom error class that matches your API's error structure
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = "ValidationError";
    }
}
// Define the user creation schema
const createUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(50).required().trim().messages({
        "string.empty": "First name is required",
        "string.min": "First name must be at least 2 characters long",
        "string.max": "First name cannot exceed 50 characters",
    }),
    lastName: joi_1.default.string().min(2).max(50).required().trim().messages({
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 2 characters long",
        "string.max": "Last name cannot exceed 50 characters",
    }),
    email: joi_1.default.string().email().required().trim().lowercase().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email is required",
    }),
    password: joi_1.default.string()
        .min(8)
        .max(100)
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
        .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
        "string.max": "Password cannot exceed 100 characters",
    }),
    phoneNumber: joi_1.default.string()
        .pattern(new RegExp("^[+]?[0-9]{10,15}$"))
        .required()
        .messages({
        "string.pattern.base": "Please provide a valid phone number",
        "string.empty": "Phone number is required",
    }),
    role: joi_1.default.string().valid("user", "admin").required().messages({
        "string.empty": "Role is required",
        "any.only": 'Role must be either "user" or "admin"',
    }),
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().trim().lowercase().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email is required",
    }),
    password: joi_1.default.string().required().messages({
        "string.empty": "Password is required",
    }),
});
const validateCreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield createUserSchema.validateAsync(req.body, {
            abortEarly: false,
            stripUnknown: true, // Remove any fields that aren't in the schema
        });
        // Replace request body with validated data
        req.body = validatedData;
        return next();
    }
    catch (error) {
        if (error instanceof joi_1.default.ValidationError) {
            // Format validation errors
            const errorDetails = error.details.map((detail) => ({
                field: detail.path[0],
                message: detail.message,
            }));
            const errorMessage = "Validation failed: " +
                errorDetails.map((err) => `${err.field} - ${err.message}`).join(", ");
            const validationError = new ValidationError(errorMessage);
            return next(validationError);
        }
        // Handle unexpected errors
        return next(error);
    }
});
exports.validateCreateUser = validateCreateUser;
const validateLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield loginSchema.validateAsync(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        req.body = validatedData;
        return next();
    }
    catch (error) {
        if (error instanceof joi_1.default.ValidationError) {
            const errorDetails = error.details.map((detail) => ({
                field: detail.path[0],
                message: detail.message,
            }));
            const errorMessage = "Validation failed: " +
                errorDetails.map((err) => `${err.field} - ${err.message}`).join(", ");
            const validationError = new ValidationError(errorMessage);
            return next(validationError);
        }
        return next(error);
    }
});
exports.validateLogin = validateLogin;
