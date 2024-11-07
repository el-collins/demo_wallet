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
// src/__tests__/services/userService.test.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const walletService_1 = require("../../src/services/walletService");
const userService_1 = require("../../src/services/userService");
const jwt_1 = require("../../src/utils/jwt");
const database_1 = require("../../src/config/database");
// Mock dependencies
jest.mock('../../config/database');
jest.mock('bcrypt');
jest.mock('../../services/walletService');
jest.mock('../../utils/jwt');
describe('UserService', () => {
    let mockTrx;
    beforeEach(() => {
        jest.clearAllMocks();
        mockTrx = {
            where: jest.fn().mockReturnThis(),
            first: jest.fn(),
            insert: jest.fn(),
            returning: jest.fn(),
            update: jest.fn(),
        };
        database_1.db.transaction.mockImplementation((fn) => fn(mockTrx));
    });
    describe('createUser', () => {
        const userData = {
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            password: 'password123',
            phoneNumber: '1234567890',
        };
        it('should create user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock dependencies
            const hashedPassword = 'hashed_password';
            bcrypt_1.default.hash.mockResolvedValue(hashedPassword);
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue(null);
            mockTrx.insert.mockResolvedValue([{ id: 'new-user-id' }]);
            walletService_1.walletService.createWallet.mockResolvedValue({ id: 'new-wallet-id' });
            // Execute
            const user = yield userService_1.userService.createUser(userData);
            // Assert
            expect(user).toBeDefined();
            expect(user.email).toBe(userData.email);
            expect(user.password).toBe(hashedPassword);
            expect(walletService_1.walletService.createWallet).toHaveBeenCalled();
        }));
        it('should throw error if email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock existing user
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue({ id: 'existing-user' });
            // Execute and assert
            yield expect(userService_1.userService.createUser(userData))
                .rejects
                .toThrow('Email/user is already in use');
        }));
    });
    describe('login', () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123',
        };
        it('should login successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock dependencies
            const user = { id: 'user-id', email: credentials.email, role: 'user' };
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue(user);
            bcrypt_1.default.compare.mockResolvedValue(true);
            jwt_1.generateToken.mockReturnValue('mock-token');
            // Execute
            const result = yield userService_1.userService.login(credentials.email, credentials.password);
            // Assert
            expect(result.user).toEqual(user);
            expect(result.token).toBe('mock-token');
            expect(jwt_1.generateToken).toHaveBeenCalledWith({
                id: user.id,
                email: user.email,
                role: user.role,
            });
        }));
        it('should throw error for invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock invalid password
            mockTrx.where.mockReturnThis();
            mockTrx.first.mockResolvedValue({ id: 'user-id' });
            bcrypt_1.default.compare.mockResolvedValue(false);
            // Execute and assert
            yield expect(userService_1.userService.login(credentials.email, credentials.password))
                .rejects
                .toThrow('Invalid credentials');
        }));
    });
    describe('updateUser', () => {
        const userId = 'test-user-id';
        const updateData = {
            firstName: 'Updated',
            lastName: 'User',
        };
        it('should update user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock update
            const updatedUser = Object.assign(Object.assign({}, updateData), { id: userId });
            mockTrx.where.mockReturnThis();
            mockTrx.update.mockReturnThis();
            mockTrx.returning.mockResolvedValue([updatedUser]);
            // Execute
            const result = yield userService_1.userService.updateUser(userId, updateData);
            // Assert
            expect(result).toEqual(updatedUser);
        }));
        it('should throw error if user not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock user not found
            mockTrx.where.mockReturnThis();
            mockTrx.update.mockReturnThis();
            mockTrx.returning.mockResolvedValue([]);
            // Execute and assert
            yield expect(userService_1.userService.updateUser(userId, updateData))
                .rejects
                .toThrow('User not found');
        }));
    });
});
