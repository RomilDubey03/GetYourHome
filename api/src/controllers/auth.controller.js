import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Cookie options for secure auth
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

// Register
const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (userExists) {
    throw new ApiError(409, "User already exists!");
  }

  // Password will be hashed by pre-save hook
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
  });

  const accessToken = user.generateAccessToken();
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  return res
    .status(201)
    .cookie("access_token", accessToken, cookieOptions)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// Login
const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("access_token", accessToken, cookieOptions)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

// Google OAuth
const google = asyncHandler(async (req, res) => {
  const { email, name, photo } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required for Google auth");
  }

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    const accessToken = user.generateAccessToken();
    const loggedInUser = await User.findById(user._id).select("-password");

    return res
      .status(200)
      .cookie("access_token", accessToken, cookieOptions)
      .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
  }

  // Create new user for Google OAuth
  const generatedPassword =
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

  const newUser = await User.create({
    username:
      name.split(" ").join("").toLowerCase() +
      Math.random().toString(36).slice(-4),
    email: email.toLowerCase(),
    password: generatedPassword,
    avatar: photo,
  });

  const accessToken = newUser.generateAccessToken();
  const createdUser = await User.findById(newUser._id).select("-password");

  return res
    .status(201)
    .cookie("access_token", accessToken, cookieOptions)
    .json(new ApiResponse(201, createdUser, "User registered via Google"));
});

// Logout
const signOut = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("access_token", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export { signup, signin, google, signOut, getCurrentUser };
