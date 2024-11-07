import { authenticateToken, authorizeAdmin } from '../../../middlewares/auth';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface RequestWithUser extends Request {
    user?: {
      role: string;
      id: string;
      email: string;
    };
  }

describe('Auth Middleware', () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

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
      const token = jwt.sign(
        { id: 'user-id', email: 'test@example.com', role: 'user' },
        process.env.JWT_SECRET || 'test-secret'
      );

      (mockRequest.header as jest.Mock).mockReturnValue(`Bearer ${token}`);

      authenticateToken(mockRequest as any, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest).toHaveProperty('user');
      expect(mockRequest.user).toHaveProperty('id', 'user-id');
    });

    it('should reject request without token', () => {
      (mockRequest.header as jest.Mock).mockReturnValue(undefined);

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Authentication token required'
      });
    });

    it('should reject invalid token', () => {
      (mockRequest.header as jest.Mock).mockReturnValue('Bearer invalid-token');

      authenticateToken(mockRequest as any, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid token'
      });
    });
  });

  describe('authorizeAdmin', () => {
    it('should allow admin access', () => {
      mockRequest.user = { role: 'admin', id: 'admin-id', email: 'admin@example.com' };

      authorizeAdmin(mockRequest as any, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should deny non-admin access', () => {
      mockRequest.user = { role: 'user', id: 'user-id', email: 'user@example.com' };

      authorizeAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Access denied'
      });
    });
  });
});