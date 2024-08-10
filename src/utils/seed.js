// utils/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Workout = require('../models/workoutModel');
const bcrypt = require('bcryptjs');

const users = [
  {
    email: 'john@mail.com',
    password: 'Password123!',
    workouts: [
      {
        title: 'Morning Run',
        reps: 1,
        load: 0,
        duration: 30,
        caloriesBurned: 300,
        notes: 'Easy 5k around the neighborhood',
        category: 'Cardio'
      },
      {
        title: 'Chest ',
        reps: 4,
        load: 80,
        duration: 45,
        caloriesBurned: 220,
        notes: 'Bench press and flyes',
        category: 'Strength'
      },
      {
        title: 'Yoga Session',
        reps: 1,
        load: 0,
        duration: 60,
        caloriesBurned: 180,
        notes: 'Hatha yoga for beginners',
        category: 'Flexibility'
      },
      {
        title: 'Interval Sprints',
        reps: 10,
        load: 0,
        duration: 20,
        caloriesBurned: 250,
        notes: '100m sprint intervals',
        category: 'Cardio'
      },
      {
        title: 'Back and Biceps',
        reps: 3,
        load: 70,
        duration: 50,
        caloriesBurned: 280,
        notes: 'Pull-ups, rows, and curls',
        category: 'Strength'
      }
    ]
  },
  {
    email: 'jane@mail.com',
    password: 'Password123!',
    workouts: [
      {
        title: 'Yoga Flow',
        reps: 1,
        load: 0,
        duration: 60,
        caloriesBurned: 180,
        notes: 'Vinyasa flow class',
        category: 'Flexibility'
      },
      {
        title: 'HIIT Session',
        reps: 5,
        load: 10,
        duration: 25,
        caloriesBurned: 300,
        notes: 'Burpees, jump squats, and mountain climbers',
        category: 'Cardio'
      },
      {
        title: 'Leg ',
        reps: 4,
        load: 100,
        duration: 55,
        caloriesBurned: 320,
        notes: 'Squats, lunges, and leg press',
        category: 'Strength'
      },
      {
        title: 'Pilates',
        reps: 1,
        load: 0,
        duration: 45,
        caloriesBurned: 150,
        notes: 'Core-focused mat work',
        category: 'Flexibility'
      },
      {
        title: 'Cycling',
        reps: 1,
        load: 0,
        duration: 90,
        caloriesBurned: 600,
        notes: '30km ride in the hills',
        category: 'Cardio'
      }
    ]
  },
  {
    email: 'bob@mail',
    password: 'Password123!',
    workouts: [
      {
        title: 'Deadlift ',
        reps: 5,
        load: 120,
        duration: 40,
        caloriesBurned: 300,
        notes: 'Focus on form and controlled reps',
        category: 'Strength'
      },
      {
        title: 'Swimming',
        reps: 1,
        load: 0,
        duration: 45,
        caloriesBurned: 400,
        notes: '1500m freestyle',
        category: 'Cardio'
      },
      {
        title: 'Shoulder Press',
        reps: 4,
        load: 50,
        duration: 30,
        caloriesBurned: 180,
        notes: 'Military press and lateral raises',
        category: 'Strength'
      },
      {
        title: 'Stretching Routine',
        reps: 1,
        load: 0,
        duration: 20,
        caloriesBurned: 80,
        notes: 'Full body stretch for recovery',
        category: 'Flexibility'
      },
      {
        title: 'Boxing',
        reps: 6,
        load: 0,
        duration: 50,
        caloriesBurned: 450,
        notes: 'Heavy bag work and speed drills',
        category: 'Cardio'
      }
    ]
  },
  {
    email: 'alice@mail.com',
    password: 'Password123!',
    workouts: [
      {
        title: 'Barre Class',
        reps: 1,
        load: 0,
        duration: 55,
        caloriesBurned: 250,
        notes: 'Full body toning and flexibility',
        category: 'Flexibility'
      },
      {
        title: 'Kettlebell Circuit',
        reps: 3,
        load: 16,
        duration: 35,
        caloriesBurned: 240,
        notes: 'Full-body kettlebell workout',
        category: 'Strength'
      },
      {
        title: 'Trail Run',
        reps: 1,
        load: 0,
        duration: 40,
        caloriesBurned: 380,
        notes: '6km run on hilly terrain',
        category: 'Cardio'
      },
      {
        title: 'Rock Climbing',
        reps: 1,
        load: 0,
        duration: 75,
        caloriesBurned: 450,
        notes: 'Bouldering session at the gym',
        category: 'Strength'
      },
      {
        title: 'Power Yoga',
        reps: 1,
        load: 0,
        duration: 65,
        caloriesBurned: 350,
        notes: 'Challenging vinyasa flow',
        category: 'Flexibility'
      }
    ]
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
      for (const workoutData of userData.workouts) {
        await Workout.create({
          ...workoutData,
          user_id: user._id
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