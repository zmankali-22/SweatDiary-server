const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Mock authentication middleware
jest.mock('../middleware/requireAuth', () => (req, res, next) => {
    req.user = { id: 'mockUserId' }; // Simulating an authenticated user
    next();
});

describe('Express Server', () => {
    test('GET /api/workouts should return 200', async () => {
        const res = await request(app).get('/api/workouts');
        expect(res.statusCode).toBe(200);
    });

    test('GET /api/user should return 200', async () => {
        const res = await request(app).get('/api/user');
        expect(res.statusCode).toBe(200);
    });

    test('GET /api/stats should return 200', async () => {
        const res = await request(app).get('/api/stats');
        expect(res.statusCode).toBe(200);
    });

    afterAll(async () => {
        await mongoose.connection.close(); // Close connection after tests
    });
});
