import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createTokens.js";

// Controller for creating a new user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please make sure you fill all the textfields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    generateToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Controller for logging in a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      generateToken(res, existingUser._id);

      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return;
    }
  }

  res.status(401);
  throw new Error("Invalid email or password");
});

// Controller for logging out a user
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "You've successfully logged out" });
});

// Controller to get all users (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Add `getAllUsers` to the export
export { createUser, loginUser, logoutCurrentUser, getAllUsers };
