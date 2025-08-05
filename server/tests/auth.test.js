const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication System', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('Register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('Login with valid credentials', async () => {
    await User.create({
      name: 'Test Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher'
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teacher@test.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});