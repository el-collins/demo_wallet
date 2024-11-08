"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = handleResponse;
exports.handleError = handleError;
exports.badRequest = badRequest;
exports.forbidden = forbidden;
exports.success = success;
exports.created = created;
exports.notFound = notFound;
exports.serverError = serverError;
const logger_1 = __importDefault(require("./logger"));
function handleResponse(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
        status: statusCode < 400,
        message,
        data,
    });
}
function handleError(res, error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    if (statusCode === 500) {
        logger_1.default.error('Error:', error);
    }
    return handleResponse(res, statusCode, message, null);
}
function badRequest(res, message, data = null) {
    return handleResponse(res, 400, message, data);
}
function forbidden(res, message, data = null) {
    return handleResponse(res, 403, message, data);
}
function success(res, message, data = null) {
    return handleResponse(res, 200, message, data);
}
function created(res, message, data = null) {
    return handleResponse(res, 201, message, data);
}
function notFound(res, message, data = null) {
    return handleResponse(res, 404, message, data);
}
function serverError(res, message, data = null) {
    return handleResponse(res, 500, message, data);
}
