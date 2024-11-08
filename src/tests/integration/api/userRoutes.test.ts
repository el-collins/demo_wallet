import request from 'supertest';
import { app } from '../../../app';
import jwt from 'jsonwebtoken';
import { db } from '../../../config/database';
import bcrypt from 'bcrypt';

jest.mock('../../../config/database');
jest.mock('../../../services/adjutorService'); // Corrected the path to mock adjutorService

describe('User API Routes', () => {
  const mockToken = jwt.sign(
    { id: 'test-user-id', email: 'test@example.com', role: 'user' },
    process.env.JWT_SECRET || 'test-secret'
  );

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

    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/user/register')
        .send(validUserData);
    
        expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body).not.toBeNull();
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = { ...validUserData, email: 'invalid-email' };

      const response = await request(app)
        .post('/api/v1/user/register')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/user/login', () => {
    const loginData = {
      email: 'johndoe12@example.com',
      password: 'Password123!'
    };

    it('should login a user successfully', async () => {
      db.where = jest.fn().mockReturnThis();
      db.first = jest.fn().mockResolvedValue({
        id: 'test-user-id',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'user',
      });

      const response = await request(app)
        .post('/api/v1/users/login')
        .send(loginData);

      console.log(response.body); // Log the response body for debugging

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data.token');
    });

    it('should return unauthorized for invalid credentials', async () => {
      const invalidLoginData = { ...loginData, password: 'wrongpassword' };

      const response = await request(app)
        .post('/api/v1/user/login')
        .send(invalidLoginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return unauthorized for invalid credentials', async () => {
      db.where = jest.fn().mockReturnThis();
      db.first = jest.fn().mockResolvedValue({
        id: 'test-user-id',
        email: 'john@example.com',
        password: await bcrypt.hash('wrongpassword', 10),
        role: 'user',
      });

      const invalidLoginData = { ...loginData, password: 'wrongpassword' };

      const response = await request(app)
        .post('/api/v1/users/login')
        .send(invalidLoginData);

      console.log(response.body); // Log the response body for debugging

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('GET /api/v1/user/me', () => {
    it('should retrieve the current user\'s information', async () => {
      const response = await request(app)
        .get('/api/v1/user/me')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data.id', 'test-user-id');
    });

    it('should return unauthorized if no token is provided', async () => {
      const response = await request(app)
        .get('/api/v1/user/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Authentication token required');
    });
  });
});