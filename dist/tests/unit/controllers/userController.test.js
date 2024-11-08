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
const userController_1 = __importDefault(require("../../../controllers/userController"));
const userService_1 = require("../../../services/userService");
jest.mock('../../../services/userService');
describe('UserController', () => {
    let req;
    let res;
    let next;
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
        it('should create a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { id: 'user-id', email: 'test@example.com' };
            userService_1.userService.createUser = jest.fn().mockResolvedValue(mockUser);
            req.body = { email: 'test@example.com', password: 'Password123!' };
            yield userController_1.default.createUser(req, res);
            expect(userService_1.userService.createUser).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'User created successfully',
                data: mockUser
            });
        }));
        it('should handle errors when creating a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error creating user');
            userService_1.userService.createUser = jest.fn().mockRejectedValue(error);
            req.body = { email: 'test@example.com', password: 'Password123!' };
            yield userController_1.default.createUser(req, res);
            expect(userService_1.userService.createUser).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error creating user',
                data: null
            });
        }));
    });
    describe('login', () => {
        it('should login a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { id: 'user-id', email: 'test@example.com', token: 'jwt-token' };
            userService_1.userService.login = jest.fn().mockResolvedValue(mockUser);
            req.body = { email: 'test@example.com', password: 'Password123!' };
            yield userController_1.default.login(req, res);
            expect(userService_1.userService.login).toHaveBeenCalledWith(req.body.email, req.body.password);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'Login successful',
                data: mockUser
            });
        }));
        it('should handle errors when logging in a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error logging in user');
            userService_1.userService.login = jest.fn().mockRejectedValue(error);
            req.body = { email: 'test@example.com', password: 'Password123!' };
            yield userController_1.default.login(req, res);
            expect(userService_1.userService.login).toHaveBeenCalledWith(req.body.email, req.body.password);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error logging in user',
                data: null
            });
        }));
    });
    describe('getUser', () => {
        it('should retrieve a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { id: 'user-id', email: 'test@example.com' };
            userService_1.userService.getUserById = jest.fn().mockResolvedValue(mockUser);
            yield userController_1.default.getUser(req, res);
            expect(userService_1.userService.getUserById).toHaveBeenCalledWith(req.user.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'User retrieved successfully',
                data: mockUser
            });
        }));
        it('should handle errors when retrieving a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error retrieving user');
            userService_1.userService.getUserById = jest.fn().mockRejectedValue(error);
            yield userController_1.default.getUser(req, res);
            expect(userService_1.userService.getUserById).toHaveBeenCalledWith(req.user.id);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error retrieving user',
                data: null
            });
        }));
    });
    describe('updateUser', () => {
        it('should update a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { id: 'user-id', email: 'test@example.com', firstName: 'Jane', lastName: 'Doe' };
            userService_1.userService.updateUser = jest.fn().mockResolvedValue(mockUser);
            req.body = { firstName: 'Jane', lastName: 'Doe' };
            yield userController_1.default.updateUser(req, res);
            expect(userService_1.userService.updateUser).toHaveBeenCalledWith(req.user.id, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: 'User updated successfully',
                data: mockUser
            });
        }));
        it('should handle errors when updating a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Error updating user');
            userService_1.userService.updateUser = jest.fn().mockRejectedValue(error);
            req.body = { firstName: 'Jane', lastName: 'Doe' };
            yield userController_1.default.updateUser(req, res);
            expect(userService_1.userService.updateUser).toHaveBeenCalledWith(req.user.id, req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: 'Error updating user',
                data: null
            });
        }));
    });
});
