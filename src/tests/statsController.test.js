const mongoose = require("mongoose");
const { getStats } = require("../controllers/statsController");
const Workout = require("../models/workoutModel");

jest.mock("../models/workoutModel");

describe("Stats Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        _id: new mongoose.Types.ObjectId(),
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return workout statistics", async () => {
    // Mock data
    const mockTotalWorkouts = 10;
    const mockTotalDuration = [{ total: 500 }];
    const mockCategoryCounts = [
      { _id: "cardio", count: 5 },
      { _id: "strength", count: 5 },
    ];
    const mockAvgDuration = [{ avg: 50 }];
    const mockTotalCalories = [{ total: 500 }];
    const mockRecentWorkout = {
      _id: "workout1",
      title: "Recent Workout",
      createdAt: new Date(),
    };

    // Mock Workout model methods
    Workout.countDocuments.mockResolvedValue(mockTotalWorkouts);
    Workout.aggregate.mockImplementation((pipeline) => {
      if (
        pipeline[1].$group.total &&
        pipeline[1].$group.total.$sum === "$duration"
      ) {
        return Promise.resolve(mockTotalDuration);
      } else if (pipeline[1].$group.avg) {
        return Promise.resolve(mockAvgDuration);
      } else if (pipeline[1].$group.count) {
        return Promise.resolve(mockCategoryCounts);
      } else {
        return Promise.resolve(mockTotalCalories);
      }
    });
    Workout.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockRecentWorkout),
    });

    await getStats(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalWorkouts: mockTotalWorkouts,
      totalDuration: mockTotalDuration[0].total,
      categoryCounts: mockCategoryCounts,
      avgDuration: mockAvgDuration[0].avg,
      totalCalories: mockTotalCalories[0].total,
      recentWorkout: mockRecentWorkout,
    });

    expect(Workout.countDocuments).toHaveBeenCalledWith({
      user_id: req.user._id,
    });
    expect(Workout.aggregate).toHaveBeenCalledTimes(4);
    expect(Workout.findOne).toHaveBeenCalledWith({
      user_id: req.user._id,
    });
  });

  it("should handle case when no workouts exist", async () => {
    Workout.countDocuments.mockResolvedValue(0);
    Workout.aggregate.mockResolvedValue([]);
    Workout.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    await getStats(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalWorkouts: 0,
      totalDuration: 0,
      categoryCounts: [],
      avgDuration: 0,
      totalCalories: 0,
      recentWorkout: null,
    });
  });
});

describe("Error handling in Stats Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        _id: new mongoose.Types.ObjectId(),
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return an error if Workout.countDocuments fails", async () => {
    Workout.countDocuments.mockRejectedValue(new Error("Mock error"));

    await getStats(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Mock error",
    });
  });

  it("should return an error if Workout.aggregate fails", async () => {
    Workout.countDocuments.mockResolvedValue(10);
    Workout.aggregate.mockRejectedValue(new Error("Aggregate error"));

    await getStats(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Aggregate error",
    });
  });

  it("should return an error if Workout.findOne fails", async () => {
    Workout.countDocuments.mockResolvedValue(10);
    Workout.aggregate.mockResolvedValue([]);
    Workout.findOne.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error("FindOne error")),
    });

    await getStats(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "FindOne error",
    });
  });
});