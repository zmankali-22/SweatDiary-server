const express = require("express");
const Workout = require("../models/workoutModel");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "GEt all workouts route!" });
});

// Get a single workout
router.get("/:id", (req, res) => {
  res.json({ message: `GET workout by id ${req.params.id}!` });
});

// POST a new workout
router.post("/", async (req, res) => {
  const { title, load, reps } = req.body;
  try {
    const workout = await Workout.create({
      title,
      load,
      reps,
    });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PAtch update a workout
router.patch("/:id", (req, res) => {
  res.json({ message: `PATCH workout by id ${req.params.id}!` });
});

// DELETE a workout
router.delete("/:id", (req, res) => {
  res.json({ message: `DELETE workout by id ${req.params.id}!` });
});

module.exports = router;
