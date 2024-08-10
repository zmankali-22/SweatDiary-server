const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { loginUser, signupUser } = require('../controllers/userController');
const User = require('../models/userModel');

jest.mock('../models/userModel');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.post('/login', loginUser);
app.post('/signup', signupUser);

describe('Auth Controller', () => {
  beforeEach(() => {
    process.env.SECRET = 'testsecret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      const mockUser = { _id: 'testid', email: 'test@example.com' };
      User.login.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('testtoken');

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ email: 'test@example.com', token: 'testtoken' });
      expect(User.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(jwt.sign).toHaveBeenCalledWith({ _id: 'testid' }, 'testsecret', { expiresIn: '3d' });
    });

    it('should return 400 if login fails', async () => {
      User.login.mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid credentials' });
    });
  });

  describe('signupUser', () => {
    it('should signup a user and return a token', async () => {
      const mockUser = { _id: 'testid', email: 'newuser@example.com' };
      User.signup.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('newtesttoken');

      const response = await request(app)
        .post('/signup')
        .send({ email: 'newuser@example.com', password: 'newpassword123' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ email: 'newuser@example.com', token: 'newtesttoken' });
      expect(User.signup).toHaveBeenCalledWith('newuser@example.com', 'newpassword123');
      expect(jwt.sign).toHaveBeenCalledWith({ _id: 'testid' }, 'testsecret', { expiresIn: '3d' });
    });

    it('should return 400 if signup fails', async () => {
      User.signup.mockRejectedValue(new Error('Email already in use'));

      const response = await request(app)
        .post('/signup')
        .send({ email: 'existinguser@example.com', password: 'password123' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Email already in use' });
    });
  });
});