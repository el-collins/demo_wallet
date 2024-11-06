// src/controllers/userController.ts
import { Request, Response } from 'express';
import { handleResponse, handleError } from '../utils/response';
import logger from '../utils/logger';
import { userService } from '../services/userService';

class UserController {

  async createUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);
      handleResponse(res, 201, 'User created successfully', user);
    } catch (error) {
      handleError(res, error);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      handleResponse(res, 200, 'User retrieved successfully', user);
    } catch (error) {
      handleError(res, error);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const user = await userService.updateUser(userId, userData);
       handleResponse(res, 200, 'User updated successfully', user);
    } catch (error) {
       handleError(res, error);
    }
  }
}

export default new UserController();