const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Workout = require('../models/workoutModel');
const { 
  createWorkout, 
  getWorkouts, 
  getWorkout, 
  deleteWorkout, 
  updateWorkout 
} = require('../controllers/workoutController');

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server', error);
    throw error;
  }
}, 10000);

afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Failed to stop MongoDB Memory Server', error);
  }
}, 10000);

beforeEach(async () => {
  await Workout.deleteMany({});
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Workout Controller', () => {
  describe('createWorkout', () => {
    it('should create a new workout', async () => {
      const req = {
        body: {
          title: 'Test Workout',
          load: 100,
          reps: 10,
          category: 'strength',
          duration: 30,
          caloriesBurned: 300,
          notes: 'Test notes'
        },
        user: { _id: 'testUserId' }
      };
      const res = mockResponse();

      await createWorkout(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Workout',
        user_id: 'testUserId'
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      const req = {
        body: { title: 'Test Workout' },
        user: { _id: 'testUserId' }
      };
      const res = mockResponse();

      await createWorkout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });

  describe('getWorkouts', () => {
    it('should return all workouts for a user', async () => {
      const userId = 'testUserId';
      await Workout.create([
        { title: 'Workout 1', load: 100, reps: 10, category: 'strength', duration: 30, user_id: userId },
        { title: 'Workout 2', load: 150, reps: 8, category: 'strength', duration: 25, user_id: userId }
      ]);

      const req = { user: { _id: userId } };
      const res = mockResponse();

      await getWorkouts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ title: 'Workout 1' }),
        expect.objectContaining({ title: 'Workout 2' })
      ]));
    });
  });

  describe('getWorkout', () => {
    it('should return a specific workout', async () => {
      const workout = await Workout.create({
        title: 'Test Workout',
        load: 100,
        reps: 10,
        category: 'strength',
        duration: 30,
        user_id: 'testUserId'
      });

      const req = { params: { id: workout._id } };
      const res = mockResponse();

      await getWorkout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Workout'
      }));
    });

    it('should return 404 if workout not found', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = mockResponse();

      await getWorkout(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Workout not found'
      }));
    });
  });

  describe('deleteWorkout', () => {
    it('should delete a specific workout', async () => {
      const workout = await Workout.create({
        title: 'Test Workout',
        load: 100,
        reps: 10,
        category: 'strength',
        duration: 30,
        user_id: 'testUserId'
      });

      const req = { params: { id: workout._id } };
      const res = mockResponse();

      await deleteWorkout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Workout'
      }));

      const deletedWorkout = await Workout.findById(workout._id);
      expect(deletedWorkout).toBeNull();
    });
  });

  describe('updateWorkout', () => {
    it('should update a specific workout', async () => {
      const workout = await Workout.create({
        title: 'Test Workout',
        load: 100,
        reps: 10,
        category: 'strength',
        duration: 30,
        user_id: 'testUserId'
      });

      const req = {
        params: { id: workout._id },
        body: { title: 'Updated Workout', load: 150 }
      };
      const res = mockResponse();

      await updateWorkout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Updated Workout',
        load: 150
      }));

      const updatedWorkout = await Workout.findById(workout._id);
      expect(updatedWorkout.title).toBe('Updated Workout');
      expect(updatedWorkout.load).toBe(150);
    });
  });
});

// Increase the timeout for all test cases
jest.setTimeout(30000);