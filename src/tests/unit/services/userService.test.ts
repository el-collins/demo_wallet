import { UserService } from '../../../services/userService';
import { db } from '../../../config/database';
import bcrypt from 'bcrypt';

jest.mock('../../../config/database');
jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const mockUserData = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe'
    };

    it('should create user successfully', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        table: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        insert: jest.fn().mockResolvedValue([1]),
        first: jest.fn().mockResolvedValue(null)
      };

      (db.transaction as jest.Mock).mockImplementation((callback) => 
        callback(mockTransaction)
      );
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await userService.createUser(mockUserData);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('nubanNumber');
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw error for duplicate email', async () => {
      const mockTransaction = {
        table: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: 'existing-user' })
      };

      (db.transaction as jest.Mock).mockImplementation((callback) => 
        callback(mockTransaction)
      );

      await expect(userService.createUser(mockUserData))
        .rejects
        .toThrow('ValidationError');
    });
  });

  describe('login', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'Password123!'
    };

    it('should authenticate valid credentials', async () => {
      const mockUser = {
        id: 'user-id',
        email: credentials.email,
        password: 'hashed_password'
      };

      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockUser)
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.login(credentials.email, credentials.password);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('should throw error for invalid credentials', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null)
      });

      await expect(userService.login(credentials.email, credentials.password))
        .rejects
        .toThrow('Invalid credentials');
    });
  });

  describe('getUserById', () => {
    it('should return user for valid userId', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockUser)
      });

      const result = await userService.getUserById('user-id');

      expect(result).toEqual(mockUser);
    });

    it('should throw error for non-existent userId', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null)
      });

      await expect(userService.getUserById('non-existent-id'))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    const mockUserData = {
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'NewPassword123!'
    };

    it('should update user successfully', async () => {
      const mockUpdatedUser = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Doe'
      };

      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue([mockUpdatedUser])
      });

      const result = await userService.updateUser('user-id', mockUserData);

      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error for non-existent user during update', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue([])
      });

      await expect(userService.updateUser('non-existent-id', mockUserData))
        .rejects
        .toThrow('User not found');
    });
  });
});