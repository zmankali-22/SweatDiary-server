const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
userSchema.statics.signup = async function (email, password) {
  // validation

  if (!email || !password) {
    throw new Error("Please provide email and password");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is weak");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await this.create({ email, password: hashedPassword });

  return user;
};

module.exports = mongoose.model("User", userSchema);
