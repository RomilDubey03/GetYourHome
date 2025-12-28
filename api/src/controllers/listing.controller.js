import Listing from "../models/listing.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Create listing
const createListing = asyncHandler(async (req, res) => {
  const listing = await Listing.create({
    ...req.body,
    userRef: req.user.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, listing, "Listing created successfully"));
});

// Delete listing
const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ApiError(404, "Listing not found!");
  }

  if (req.user.id !== listing.userRef.toString()) {
    throw new ApiError(401, "You can only delete your own listings!");
  }

  await Listing.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Listing deleted successfully"));
});

// Update listing
const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ApiError(404, "Listing not found!");
  }

  if (req.user.id !== listing.userRef.toString()) {
    throw new ApiError(401, "You can only update your own listings!");
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedListing, "Listing updated successfully"));
});

// Get single listing
const getListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ApiError(404, "Listing not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "Listing fetched successfully"));
});

// Get listings with search/filter
const getListings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;

  let offer = req.query.offer;
  if (offer === undefined || offer === "false") {
    offer = { $in: [false, true] };
  }

  let furnished = req.query.furnished;
  if (furnished === undefined || furnished === "false") {
    furnished = { $in: [false, true] };
  }

  let parking = req.query.parking;
  if (parking === undefined || parking === "false") {
    parking = { $in: [false, true] };
  }

  let type = req.query.type;
  if (type === undefined || type === "all") {
    type = { $in: ["sale", "rent"] };
  }

  const searchTerm = req.query.searchTerm || "";
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  const listings = await Listing.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Listings fetched successfully"));
});

// Save/Unsave listing
const saveListingToggle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { type } = req.query;

  let userDoc;
  if (type && type === "unsave") {
    userDoc = await User.findByIdAndUpdate(
      userId,
      { $pull: { saved: id } },
      { new: true }
    ).select("-password");
  } else {
    userDoc = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { saved: id } },
      { new: true }
    ).select("-password");
  }

  const message = type === "unsave" ? "Listing unsaved" : "Listing saved";

  return res.status(200).json(new ApiResponse(200, userDoc, message));
});

export {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  saveListingToggle,
};
