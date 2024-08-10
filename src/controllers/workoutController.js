const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

// get all workouts
const getWorkouts = async (req, res) => {
    try {
        const user_id = req.user._id;
        const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch workouts" });
    }
};

// get a single workout
const getWorkout = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such workout" });
    }

    try {
        const workout = await Workout.findById(id);
        if (!workout) return res.status(404).json({ error: "Workout not found" });
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch workout" });
    }
};

// create a new workout
const createWorkout = async (req, res) => {
    const { title, load, reps, category, duration, caloriesBurned, notes } = req.body;

    let emptyFields = [];
    if (!title) emptyFields.push("title");
    if (!load) emptyFields.push("load");
    if (!reps) emptyFields.push("reps");
    if (!category) emptyFields.push("category");
    if (!duration) emptyFields.push("duration");

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: `Please provide values for: ${emptyFields.join(", ")}` });
    }

    try {
        const user_id = req.user._id;
        const workout = await Workout.create({
            title,
            load,
            reps,
            category,
            duration,
            caloriesBurned,
            notes,
            user_id,
        });
        res.status(201).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a workout
const deleteWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such workout" });
    }

    try {
        const workout = await Workout.findOneAndDelete({ _id: id });
        if (!workout) return res.status(404).json({ error: "Workout not found" });
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete workout" });
    }
};

// update a workout
const updateWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such workout" });
    }

    try {
        const workout = await Workout.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true }
        );
        if (!workout) return res.status(404).json({ error: "Workout not found" });
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: "Failed to update workout" });
    }
};

module.exports = { createWorkout, getWorkouts, getWorkout, deleteWorkout, updateWorkout };
