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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
describe('Complex Wallet Operations', () => {
    const mockToken = jsonwebtoken_1.default.sign({ id: 'test-user-id', email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET || 'test-secret');
    describe('POST /api/v1/wallets/batch-transfer', () => {
        it('should process batch transfers successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const batchTransferData = {
                transfers: [
                    {
                        toUserId: 'recipient-1',
                        amount: 100.00,
                        reference: 'batch-1-ref'
                    },
                    {
                        toUserId: 'recipient-2',
                        amount: 200.00,
                        reference: 'batch-2-ref'
                    }
                ]
            };
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/wallets/batch-transfer')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(batchTransferData);
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('successfulTransfers');
            expect(response.body.data.successfulTransfers).toHaveLength(2);
        }));
        it('should handle partial batch transfer failure', () => __awaiter(void 0, void 0, void 0, function* () {
            const batchTransferData = {
                transfers: [
                    {
                        toUserId: 'recipient-1',
                        amount: 1000000.00, // Amount exceeds balance
                        reference: 'batch-1-ref'
                    },
                    {
                        toUserId: 'recipient-2',
                        amount: 200.00,
                        reference: 'batch-2-ref'
                    }
                ]
            };
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/wallets/batch-transfer')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(batchTransferData);
            expect(response.status).toBe(207);
            expect(response.body.data).toHaveProperty('failedTransfers');
            expect(response.body.data.failedTransfers).toHaveLength(1);
        }));
    });
    describe('GET /api/v1/wallets/transaction-history', () => {
        it('should return paginated transaction history', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/v1/wallets/transaction-history')
                .query({ page: 1, limit: 10 })
                .set('Authorization', `Bearer ${mockToken}`);
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('transactions');
            expect(response.body.data).toHaveProperty('pagination');
        }));
        it('should filter transaction history by date range', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/v1/wallets/transaction-history')
                .query({
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            })
                .set('Authorization', `Bearer ${mockToken}`);
            expect(response.status).toBe(200);
            expect(response.body.data.transactions).toBeInstanceOf(Array);
        }));
    });
    describe('POST /api/v1/wallets/withdraw', () => {
        it('should handle withdrawal with insufficient funds', () => __awaiter(void 0, void 0, void 0, function* () {
            const withdrawData = {
                amount: 1000000.00,
                reference: 'withdraw-ref'
            };
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/wallets/withdraw')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(withdrawData);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Insufficient funds');
        }));
        it('should prevent duplicate withdrawal references', () => __awaiter(void 0, void 0, void 0, function* () {
            const withdrawData = {
                amount: 100.00,
                reference: 'duplicate-ref'
            };
            // First withdrawal
            yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/wallets/withdraw')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(withdrawData);
            // Duplicate withdrawal
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/v1/wallets/withdraw')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(withdrawData);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Duplicate transaction reference');
        }));
    });
});
