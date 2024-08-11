require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");
const statsRoutes = require("./routes/stats");

const PORT = process.env.PORT || 3000;

// express app
const app = express();

//middleware
app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);

// connect to MongoDB

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // listen to requests
    app.listen(PORT, () => {
      console.log(
        " connected to DB and Server is listening on port",
        PORT
      );
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

module.exports = app;
