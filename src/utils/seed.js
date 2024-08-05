// utils/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const users = [
  {
    email: 'john@example.com',
    password: 'Password123!'
  },
  {
    email: 'jane@example.com',
    password: 'Password123!'
  },
  {
    email: 'bob@example.com',
    password: 'Password123!'
  },
  {
    email: 'alice@example.com',
    password: 'Password123!'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({
        email: user.email,
        password: hashedPassword
      });
    }

    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedUsers();