"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../../middlewares/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('Auth Middleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    beforeEach(() => {
        mockRequest = {
            header: jest.fn()
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });
    describe('authenticateToken', () => {
        it('should authenticate valid token', () => {
            const token = jsonwebtoken_1.default.sign({ id: 'user-id', email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET || 'test-secret');
            mockRequest.header.mockReturnValue(`Bearer ${token}`);
            (0, auth_1.authenticateToken)(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(mockRequest).toHaveProperty('user');
            expect(mockRequest.user).toHaveProperty('id', 'user-id');
        });
        it('should reject request without token', () => {
            mockRequest.header.mockReturnValue(undefined);
            (0, auth_1.authenticateToken)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Authentication token required'
            });
        });
        it('should reject invalid token', () => {
            mockRequest.header.mockReturnValue('Bearer invalid-token');
            (0, auth_1.authenticateToken)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid token'
            });
        });
    });
    describe('authorizeAdmin', () => {
        it('should allow admin access', () => {
            mockRequest.user = { role: 'admin', id: 'admin-id', email: 'admin@example.com' };
            (0, auth_1.authorizeAdmin)(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
        });
        it('should deny non-admin access', () => {
            mockRequest.user = { role: 'user', id: 'user-id', email: 'user@example.com' };
            (0, auth_1.authorizeAdmin)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Access denied'
            });
        });
    });
});
