import request from 'supertest';
import { app } from '../../../app';
// import { knex } from '../../../config/database';
import jwt from 'jsonwebtoken';

jest.mock('../../../config/database');
jest.mock('../../../utils/adjutorClient');

describe('User API Routes', () => {
  const mockToken = jwt.sign(
    { id: 'test-user-id', email: 'test@example.com', role: 'user' },
    process.env.JWT_SECRET || 'test-secret'
  );

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

    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data.id');
      expect(response.body.data.email).toBe(validUserData.email);
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = { ...validUserData, email: 'invalid-email' };

      const response = await request(app)
        .post('/api/v1/users')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
});