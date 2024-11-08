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
// import { knex } from '../../../config/database';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('../../../config/database');
jest.mock('../../../utils/adjutorClient');
describe('User API Routes', () => {
    const mockToken = jsonwebtoken_1.default.sign({ id: 'test-user-id', email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET || 'test-secret');
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /api/v1/users', () => {
        const validUserData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'Password123!',
            phoneNumber: '+2341234567890',
            role: 'user'
        };
        it('should create a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/users')
                .send(validUserData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('data.id');
            expect(response.body.data.email).toBe(validUserData.email);
        }));
        it('should return validation error for invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidData = Object.assign(Object.assign({}, validUserData), { email: 'invalid-email' });
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/users')
                .send(invalidData);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        }));
    });
});
