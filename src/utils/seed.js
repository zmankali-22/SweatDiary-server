// utils/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Workout = require('../models/workoutModel');
const bcrypt = require('bcryptjs');

const users = [
  {
    email: 'john@example.com',
    password: 'Password123!'
  },
  {
    email: 'jane@example.com',
    password: 'StrongPass456!'
  },
  {
    email: 'bob@example.com',
    password: 'SecurePassword789!'
  },
  {
    email: 'alice@example.com',
    password: 'ComplexPass321!'
  }
];

const workoutTemplates = [
  {
    title: 'Morning Jog',
    reps: 1,
    load: 0,
    duration: 30,
    caloriesBurned: 300,
    notes: 'Easy pace around the park',
    category: 'Cardio'
  },
  {
    title: 'Weight Training',
    reps: 12,
    load: 50,
    duration: 45,
    caloriesBurned: 200,
    notes: 'Focus on upper body',
    category: 'Strength'
  },
  {
    title: 'Yoga Session',
    reps: 1,
    load: 0,
    duration: 60,
    caloriesBurned: 150,
    notes: 'Relaxing evening routine',
    category: 'Flexibility'
  },
  {
    title: 'HIIT Workout',
    reps: 5,
    load: 10,
    duration: 20,
    caloriesBurned: 250,
    notes: 'High intensity intervals',
    category: 'Cardio'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing users and workouts
    await User.deleteMany({});
    await Workout.deleteMany({});
    console.log('Cleared existing users and workouts');

    // Create new users and their workouts
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        email: userData.email,
        password: hashedPassword
      });

      // Create workouts for this user
      for (const workoutTemplate of workoutTemplates) {
        await Workout.create({
          ...workoutTemplate,
          user_id: user._id,
          // Add some randomness to make each user's workouts unique
          load: workoutTemplate.load + Math.floor(Math.random() * 10),
          duration: workoutTemplate.duration + Math.floor(Math.random() * 15),
          caloriesBurned: workoutTemplate.caloriesBurned + Math.floor(Math.random() * 50),
        });
      }
    }

    console.log('Users and workouts seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();