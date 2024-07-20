// controllers/statsController.js

const Workout = require('../models/workoutModel');

const getStats = async (req, res) => {
  const user_id = req.user._id;
  
  try {
    // Total number of workouts
    const totalWorkouts = await Workout.countDocuments({ user_id });

    // Total duration of all workouts
    const totalDuration = await Workout.aggregate([
      { $match: { user_id: user_id.toString() } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    // Workouts by category
    const categoryCounts = await Workout.aggregate([
      { $match: { user_id: user_id.toString() } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Average workout duration
    const avgDuration = await Workout.aggregate([
      { $match: { user_id: user_id.toString() } },
      { $group: { _id: null, avg: { $avg: '$duration' } } }
    ]);

    // Total calories burned
    const totalCalories = await Workout.aggregate([
      { $match: { user_id: user_id.toString() } },
      { $group: { _id: null, total: { $sum: '$caloriesBurned' } } }
    ]);

    // Most recent workout
    const recentWorkout = await Workout.findOne({ user_id }).sort({ createdAt: -1 });

    res.status(200).json({
      totalWorkouts,
      totalDuration: totalDuration[0]?.total || 0,
      categoryCounts,
      avgDuration: avgDuration[0]?.avg || 0,
      totalCalories: totalCalories[0]?.total || 0,
      recentWorkout
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getStats };