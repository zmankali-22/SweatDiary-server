const express = require("express");
const { createWorkout, getWorkouts, getWorkout, deleteWorkout, updateWorkout } = require("../controllers/workoutController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all workout routes
router.use(requireAuth)

router.get("/", getWorkouts);

// Get a single workout
router.get("/:id", getWorkout);

// POST a new workout
router.post("/", createWorkout );

// PAtch update a workout
router.patch("/:id",updateWorkout);

// DELETE a workout
router.delete("/:id", deleteWorkout);

module.exports = router;
