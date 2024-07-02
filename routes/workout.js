

const express = require('express')

const router = express.Router()

router.get("/", (req, res) => {
    res.json({ message: "GEt all workouts route!" })
})


// Get a single workout
router.get("/:id", (req, res) => {
    res.json({ message: `GET workout by id ${req.params.id}!` })
})

// POST a new workout
router.post("/", (req, res) => {
    res.json({ message: "POST new workout route!" })
})

// PAtch update a workout
router.patch("/:id", (req, res) => {
    res.json({ message: `PATCH workout by id ${req.params.id}!` })
})

// DELETE a workout
router.delete("/:id", (req, res) => {
    res.json({ message: `DELETE workout by id ${req.params.id}!` })
})


module.exports = router