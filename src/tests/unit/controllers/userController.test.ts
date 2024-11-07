import { Request, Response } from 'express';
import userController from '../../../controllers/userController';
import { userService } from '../../../services/userService';

jest.mock('../../../services/userService');

describe('UserController', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      user: { id: 'user-id', email: 'test@example.com' },
      body: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      userService.createUser = jest.fn().mockResolvedValue(mockUser);

      req.body = { email: 'test@example.com', password: 'Password123!' };
      await userController.createUser(req, res);

      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'User created successfully',
        data: mockUser
      });
    });

    it('should handle errors when creating a user', async () => {
      const error = new Error('Error creating user');
      userService.createUser = jest.fn().mockRejectedValue(error);

      req.body = { email: 'test@example.com', password: 'Password123!' };
      await userController.createUser(req, res);

      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error creating user',
        data: null
      });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com', token: 'jwt-token' };
      userService.login = jest.fn().mockResolvedValue(mockUser);

      req.body = { email: 'test@example.com', password: 'Password123!' };
      await userController.login(req, res);

      expect(userService.login).toHaveBeenCalledWith(req.body.email, req.body.password);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Login successful',
        data: mockUser
      });
    });

    it('should handle errors when logging in a user', async () => {
      const error = new Error('Error logging in user');
      userService.login = jest.fn().mockRejectedValue(error);

      req.body = { email: 'test@example.com', password: 'Password123!' };
      await userController.login(req, res);

      expect(userService.login).toHaveBeenCalledWith(req.body.email, req.body.password);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error logging in user',
        data: null
      });
    });
  });

  describe('getUser', () => {
    it('should retrieve a user successfully', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      userService.getUserById = jest.fn().mockResolvedValue(mockUser);

      await userController.getUser(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith(req.user.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'User retrieved successfully',
        data: mockUser
      });
    });

    it('should handle errors when retrieving a user', async () => {
      const error = new Error('Error retrieving user');
      userService.getUserById = jest.fn().mockRejectedValue(error);

      await userController.getUser(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith(req.user.id);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error retrieving user',
        data: null
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com', firstName: 'Jane', lastName: 'Doe' };
      userService.updateUser = jest.fn().mockResolvedValue(mockUser);

      req.body = { firstName: 'Jane', lastName: 'Doe' };
      await userController.updateUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith(req.user.id, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'User updated successfully',
        data: mockUser
      });
    });

    it('should handle errors when updating a user', async () => {
      const error = new Error('Error updating user');
      userService.updateUser = jest.fn().mockRejectedValue(error);

      req.body = { firstName: 'Jane', lastName: 'Doe' };
      await userController.updateUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith(req.user.id, req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Error updating user',
        data: null
      });
    });
  });
});