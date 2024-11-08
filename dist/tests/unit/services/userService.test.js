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
const userService_1 = require("../../../services/userService");
const database_1 = require("../../../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock('../../../config/database');
jest.mock('bcrypt');
describe('UserService', () => {
    let userService;
    beforeEach(() => {
        userService = new userService_1.UserService();
        jest.clearAllMocks();
    });
    describe('createUser', () => {
        const mockUserData = {
            email: 'test@example.com',
            password: 'Password123!',
            firstName: 'John',
            lastName: 'Doe'
        };
        it('should create user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn(),
                table: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                insert: jest.fn().mockResolvedValue([1]),
                first: jest.fn().mockResolvedValue(null)
            };
            database_1.db.transaction.mockImplementation((callback) => callback(mockTransaction));
            bcrypt_1.default.hash.mockResolvedValue('hashed_password');
            const result = yield userService.createUser(mockUserData);
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('nubanNumber');
            expect(bcrypt_1.default.hash).toHaveBeenCalledWith(mockUserData.password, 10);
            expect(mockTransaction.commit).toHaveBeenCalled();
        }));
        it('should throw error for duplicate email', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTransaction = {
                table: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue({ id: 'existing-user' })
            };
            database_1.db.transaction.mockImplementation((callback) => callback(mockTransaction));
            yield expect(userService.createUser(mockUserData))
                .rejects
                .toThrow('ValidationError');
        }));
    });
    describe('login', () => {
        const credentials = {
            email: 'test@example.com',
            password: 'Password123!'
        };
        it('should authenticate valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 'user-id',
                email: credentials.email,
                password: 'hashed_password'
            };
            database_1.db.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockUser)
            });
            bcrypt_1.default.compare.mockResolvedValue(true);
            const result = yield userService.login(credentials.email, credentials.password);
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
        }));
        it('should throw error for invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            database_1.db.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(null)
            });
            yield expect(userService.login(credentials.email, credentials.password))
                .rejects
                .toThrow('Invalid credentials');
        }));
    });
    describe('getUserById', () => {
        it('should return user for valid userId', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 'user-id',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe'
            };
            database_1.db.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockUser)
            });
            const result = yield userService.getUserById('user-id');
            expect(result).toEqual(mockUser);
        }));
        it('should throw error for non-existent userId', () => __awaiter(void 0, void 0, void 0, function* () {
            database_1.db.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(null)
            });
            yield expect(userService.getUserById('non-existent-id'))
                .rejects
                .toThrow('User not found');
        }));
    });
    describe('updateUser', () => {
        const mockUserData = {
            firstName: 'Jane',
            lastName: 'Doe',
            password: 'NewPassword123!'
        };
        it('should update user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUpdatedUser = {
                id: 'user-id',
                email: 'test@example.com',
                firstName: 'Jane',
                lastName: 'Doe'
            };
            database_1.db.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                update: jest.fn().mockResolvedValue([mockUpdatedUser])
            });
            const result = yield userService.updateUser('user-id', mockUserData);
            expect(result).toEqual(mockUpdatedUser);
        }));
        it('should throw error for non-existent user during update', () => __awaiter(void 0, void 0, void 0, function* () {
            database_1.db.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                update: jest.fn().mockResolvedValue([])
            });
            yield expect(userService.updateUser('non-existent-id', mockUserData))
                .rejects
                .toThrow('User not found');
        }));
    });
});
