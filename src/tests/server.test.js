const request = require('supertest');
const app = require('../server'); // Adjust the path as needed
const User = require('../models/userModel'); // Adjust the path as needed
const jwt = require('jsonwebtoken');

describe('Server', () => {
  let token;

  beforeAll(async () => {
    // Create a test user and generate a token
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'password123'
    });
    
    token = jwt.sign({ _id: testUser._id }, process.env.SECRET, { expiresIn: '3d' });
  });

  afterAll(async () => {
    // Clean up: remove the test user
    await User.deleteMany({ email: 'test@example.com' });
  });

  it('should respond to GET /api/workouts with authentication', async () => {
    const response = await request(app)
      .get('/api/workouts')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });

  it('should return 401 for GET /api/workouts without authentication', async () => {
    const response = await request(app).get('/api/workouts');
    expect(response.status).toBe(401);
  });
});