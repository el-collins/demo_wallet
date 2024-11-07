import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../../../app';

describe('Complex Wallet Operations', () => {
    const mockToken = jwt.sign(
      { id: 'test-user-id', email: 'test@example.com', role: 'user' },
      process.env.JWT_SECRET || 'test-secret'
    );
  
    describe('POST /api/v1/wallets/batch-transfer', () => {
      it('should process batch transfers successfully', async () => {
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
  
        const response = await request(app)
          .post('/api/v1/wallets/batch-transfer')
          .set('Authorization', `Bearer ${mockToken}`)
          .send(batchTransferData);
  
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('successfulTransfers');
        expect(response.body.data.successfulTransfers).toHaveLength(2);
      });
  
      it('should handle partial batch transfer failure', async () => {
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
  
        const response = await request(app)
          .post('/api/v1/wallets/batch-transfer')
          .set('Authorization', `Bearer ${mockToken}`)
          .send(batchTransferData);
  
        expect(response.status).toBe(207);
        expect(response.body.data).toHaveProperty('failedTransfers');
        expect(response.body.data.failedTransfers).toHaveLength(1);
      });
    });
  
    describe('GET /api/v1/wallets/transaction-history', () => {
      it('should return paginated transaction history', async () => {
        const response = await request(app)
          .get('/api/v1/wallets/transaction-history')
          .query({ page: 1, limit: 10 })
          .set('Authorization', `Bearer ${mockToken}`);
  
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('transactions');
        expect(response.body.data).toHaveProperty('pagination');
      });
  
      it('should filter transaction history by date range', async () => {
        const response = await request(app)
          .get('/api/v1/wallets/transaction-history')
          .query({
            startDate: '2024-01-01',
            endDate: '2024-12-31'
          })
          .set('Authorization', `Bearer ${mockToken}`);
  
        expect(response.status).toBe(200);
        expect(response.body.data.transactions).toBeInstanceOf(Array);
      });
    });
  
    describe('POST /api/v1/wallets/withdraw', () => {
      it('should handle withdrawal with insufficient funds', async () => {
        const withdrawData = {
          amount: 1000000.00,
          reference: 'withdraw-ref'
        };
  
        const response = await request(app)
          .post('/api/v1/wallets/withdraw')
          .set('Authorization', `Bearer ${mockToken}`)
          .send(withdrawData);
  
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Insufficient funds');
      });
  
      it('should prevent duplicate withdrawal references', async () => {
        const withdrawData = {
          amount: 100.00,
          reference: 'duplicate-ref'
        };
  
        // First withdrawal
        await request(app)
          .post('/api/v1/wallets/withdraw')
          .set('Authorization', `Bearer ${mockToken}`)
          .send(withdrawData);
  
        // Duplicate withdrawal
        const response = await request(app)
          .post('/api/v1/wallets/withdraw')
          .set('Authorization', `Bearer ${mockToken}`)
          .send(withdrawData);
  
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Duplicate transaction reference');
      });
    });
  });