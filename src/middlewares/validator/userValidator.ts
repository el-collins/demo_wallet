import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { handleError } from "../../utils/response";

// Custom error class that matches your API's error structure
class ValidationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    this.name = "ValidationError";
  }
}

// Define the user creation schema
const createUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().trim().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name cannot exceed 50 characters",
  }),

  lastName: Joi.string().min(2).max(50).required().trim().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters long",
    "string.max": "Last name cannot exceed 50 characters",
  }),

  email: Joi.string().email().required().trim().lowercase().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .max(100)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      "string.max": "Password cannot exceed 100 characters",
    }),

  phoneNumber: Joi.string()
    .pattern(new RegExp("^[+]?[0-9]{10,15}$"))
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
      "string.empty": "Phone number is required",
    }),

  role: Joi.string().valid("user", "admin").required().messages({
    "string.empty": "Role is required",
    "any.only": 'Role must be either "user" or "admin"',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const validateCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = await createUserSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true, // Remove any fields that aren't in the schema
    });

    // Replace request body with validated data
    req.body = validatedData;
    return next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      // Format validation errors
      const errorDetails = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      const errorMessage =
        "Validation failed: " +
        errorDetails.map((err) => `${err.field} - ${err.message}`).join(", ");

      const validationError = new ValidationError(errorMessage);
      return next(validationError);
    }

    // Handle unexpected errors
    return next(error);
  }
};

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = await loginSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    req.body = validatedData;
    return next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      const errorMessage =
        "Validation failed: " +
        errorDetails.map((err) => `${err.field} - ${err.message}`).join(", ");

      const validationError = new ValidationError(errorMessage);
      return next(validationError);
    }

    return next(error);
  }
}
