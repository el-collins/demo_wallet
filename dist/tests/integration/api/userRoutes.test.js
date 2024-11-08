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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock('../../../config/database');
jest.mock('../../../services/adjutorService'); // Corrected the path to mock adjutorService
describe('User API Routes', () => {
    const mockToken = jsonwebtoken_1.default.sign({ id: 'test-user-id', email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET || 'test-secret');
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /api/v1/user/register', () => {
        const validUserData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe12@example.com',
            password: 'Password123!',
            phoneNumber: '+2341234567890',
            role: 'user'
        };
        it('should create a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/user/register')
                .send(validUserData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body).not.toBeNull();
        }));
        it('should return validation error for invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidData = Object.assign(Object.assign({}, validUserData), { email: 'invalid-email' });
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/user/register')
                .send(invalidData);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        }));
    });
    describe('POST /api/v1/user/login', () => {
        const loginData = {
            email: 'johndoe12@example.com',
            password: 'Password123!'
        };
        it('should login a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            database_1.db.where = jest.fn().mockReturnThis();
            database_1.db.first = jest.fn().mockResolvedValue({
                id: 'test-user-id',
                email: 'john@example.com',
                password: 'Password123!',
                role: 'user',
            });
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/users/login')
                .send(loginData);
            console.log(response.body); // Log the response body for debugging
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data.token');
        }));
        it('should return unauthorized for invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidLoginData = Object.assign(Object.assign({}, loginData), { password: 'wrongpassword' });
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/user/login')
                .send(invalidLoginData);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid credentials');
        }));
        it('should return unauthorized for invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            database_1.db.where = jest.fn().mockReturnThis();
            database_1.db.first = jest.fn().mockResolvedValue({
                id: 'test-user-id',
                email: 'john@example.com',
                password: yield bcrypt_1.default.hash('wrongpassword', 10),
                role: 'user',
            });
            const invalidLoginData = Object.assign(Object.assign({}, loginData), { password: 'wrongpassword' });
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/users/login')
                .send(invalidLoginData);
            console.log(response.body); // Log the response body for debugging
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid credentials');
        }));
    });
    describe('GET /api/v1/user/me', () => {
        it('should retrieve the current user\'s information', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/v1/user/me')
                .set('Authorization', `Bearer ${mockToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data.id', 'test-user-id');
        }));
        it('should return unauthorized if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/v1/user/me');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Authentication token required');
        }));
    });
});
