const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    load: {
      type: Number,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    }, // in minutes

    caloriesBurned: {
      type: Number,
    },

    notes: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    }, // e.g., 'Cardio', 'Strength', 'Flexibility'
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workout", workoutSchema);