import { User } from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

// Update user info
const updateUserInfo = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    throw new ApiError(401, "You can only update your own account!");
  }

  const updateData = {
    username: req.body.username,
    email: req.body.email,
    avatar: req.body.avatar,
  };

  // If password is being updated, hash it
  if (req.body.password) {
    updateData.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    throw new ApiError(401, "You can only delete your own account!");
  }

  await User.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .clearCookie("access_token", cookieOptions)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

// Get user listings
const getUserListings = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    throw new ApiError(401, "You can only view your own listings!");
  }

  const listings = await Listing.find({ userRef: req.params.id });

  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Listings fetched successfully"));
});

// Get user by ID
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

// Save listing
const saveListing = asyncHandler(async (req, res) => {
  const userDoc = await User.findById(req.user.id);
  const { listingId } = req.params;

  if (!userDoc.saved.includes(listingId)) {
    userDoc.saved.push(listingId);
    await userDoc.save();
  }

  const updatedUser = await User.findById(req.user.id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Listing saved successfully"));
});

// Get saved listings
const getSavedListings = asyncHandler(async (req, res) => {
  const { saved } = await User.findById(req.user.id).populate("saved");

  return res
    .status(200)
    .json(new ApiResponse(200, saved, "Saved listings fetched successfully"));
});

export {
  updateUserInfo,
  deleteUser,
  getUserListings,
  getUser,
  saveListing,
  getSavedListings,
};
