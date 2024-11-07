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
const userController_1 = __importDefault(require("../../src/controllers/userController"));
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
describe('UserController', () => {
    it('getUser should return user data', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = node_mocks_http_1.default.createRequest({
            method: 'GET',
            url: '/user/1',
            params: {
                id: '1',
            },
        });
        const res = node_mocks_http_1.default.createResponse();
        yield userController_1.default.getUser(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({ id: '1' }));
    }));
    it('createUser should return created user', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = node_mocks_http_1.default.createRequest({
            method: 'POST',
            url: '/user',
            body: {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'Password123!',
                phoneNumber: '+1234567890',
                role: 'user',
            },
        });
        const res = node_mocks_http_1.default.createResponse();
        yield userController_1.default.createUser(req, res);
        expect(res.statusCode).toBe(201);
        expect(res._getData()).toEqual(expect.objectContaining({ email: 'test@example.com' }));
    }));
});
