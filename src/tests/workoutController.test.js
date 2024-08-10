jest.mock('../models/workoutModel');
jest.mock('mongoose');

const Workout = require('../models/workoutModel');
// Mock the Workout model methods
jest.mock('../models/workoutModel', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findOneAndDelete: jest.fn(),
    findOneAndUpdate: jest.fn(),
  }));
  
  // Import the mongoose package and mock its methods if needed
  const mongoose = require('mongoose');
  jest.mock('mongoose', () => ({
    Types: {
      ObjectId: {
        isValid: jest.fn().mockReturnValue(true),
      },
    },
  }));
  
  // Import your controller functions
  const {
    createWorkout,
    getWorkouts,
    getWorkout,
    deleteWorkout,
    updateWorkout,
  } = require('../controllers/workoutController');
  
  describe('Workout Controller', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {},
        params: {},
        user: { _id: 'user123' },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    describe('getWorkouts', () => {
      it('should get all workouts for a user', async () => {
        const mockWorkouts = [{ title: 'Workout 1' }, { title: 'Workout 2' }];
        Workout.find.mockResolvedValue(mockWorkouts);
  
        await getWorkouts(req, res);
  
        expect(Workout.find).toHaveBeenCalledWith({ user_id: 'user123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockWorkouts);
      });
  
      it('should handle errors when fetching workouts', async () => {
        Workout.find.mockRejectedValue(new Error('Database error'));
  
        await getWorkouts(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch workouts' });
      });
    });
  
    describe('getWorkout', () => {
      it('should get a single workout by id', async () => {
        const mockWorkout = { title: 'Workout 1' };
        req.params.id = 'workout123';
        Workout.findById.mockResolvedValue(mockWorkout);
  
        await getWorkout(req, res);
  
        expect(Workout.findById).toHaveBeenCalledWith('workout123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockWorkout);
      });
  
      it('should return 404 if workout is not found', async () => {
        req.params.id = 'workout123';
        Workout.findById.mockResolvedValue(null);
  
        await getWorkout(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Workout not found' });
      });
    });
  
    describe('createWorkout', () => {
      it('should create a new workout', async () => {
        const workoutData = {
          title: 'New Workout',
          load: 50,
          reps: 10,
          category: 'Strength',
          duration: 30,
        };
        req.body = workoutData;
        const createdWorkout = { ...workoutData, _id: 'workout123' };
        Workout.create.mockResolvedValue(createdWorkout);
  
        await createWorkout(req, res);
  
        expect(Workout.create).toHaveBeenCalledWith({
          ...workoutData,
          user_id: 'user123',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(createdWorkout);
      });
  
      it('should return 400 if required fields are missing', async () => {
        req.body = { title: 'New Workout' };
  
        await createWorkout(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Please provide values for: load, reps, category, duration',
        });
      });
    });
  
    describe('deleteWorkout', () => {
      it('should delete a workout', async () => {
        req.params.id = 'workout123';
        const deletedWorkout = { _id: 'workout123', title: 'Deleted Workout' };
        Workout.findOneAndDelete.mockResolvedValue(deletedWorkout);
  
        await deleteWorkout(req, res);
  
        expect(Workout.findOneAndDelete).toHaveBeenCalledWith({ _id: 'workout123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(deletedWorkout);
      });
  
      it('should return 404 if workout to delete is not found', async () => {
        req.params.id = 'workout123';
        Workout.findOneAndDelete.mockResolvedValue(null);
  
        await deleteWorkout(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Workout not found' });
      });
    });
  
    describe('updateWorkout', () => {
      it('should update a workout', async () => {
        req.params.id = 'workout123';
        const updatedWorkout = { _id: 'workout123', title: 'Updated Workout' };
        Workout.findOneAndUpdate.mockResolvedValue(updatedWorkout);
  
        await updateWorkout(req, res);
  
        expect(Workout.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: 'workout123' },
          req.body,
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedWorkout);
      });
  
      it('should return 404 if workout to update is not found', async () => {
        req.params.id = 'workout123';
        Workout.findOneAndUpdate.mockResolvedValue(null);
  
        await updateWorkout(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Workout not found' });
      });
    });
  });