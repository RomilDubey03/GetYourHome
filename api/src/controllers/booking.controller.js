import Booking from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Create booking
const createBooking = asyncHandler(async (req, res) => {
  const {
    listingId,
    ownerId,
    bookerMessage,
    checkInDate,
    checkOutDate,
    appliedFor,
  } = req.body;
  const userId = req.user.id;

  const bookingDoc = await Booking.create({
    booker: userId,
    owner: ownerId,
    listing: listingId,
    bookerMessage,
    checkInDate: checkInDate || Date.now(),
    checkOutDate: checkOutDate || Date.now(),
    appliedFor,
    status: "pending",
  });

  // Update booker's userBookings
  await User.findByIdAndUpdate(userId, {
    $push: { userBookings: bookingDoc._id },
  });

  // Update owner's receivedBookings
  await User.findByIdAndUpdate(ownerId, {
    $push: { receivedBookings: bookingDoc._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, bookingDoc, "Booking created successfully"));
});

// Resolve booking (accept/reject)
const resolveBooking = asyncHandler(async (req, res) => {
  const { responseMessage, bookingId, status, resolvedAt } = req.body;
  const bookingDoc = await Booking.findById(bookingId);

  if (!bookingDoc) {
    throw new ApiError(404, "Booking not found");
  }

  if (bookingDoc.owner.toString() !== req.user.id) {
    throw new ApiError(401, "Only the owner can resolve the booking");
  }

  bookingDoc.responseMessage = responseMessage || "";
  bookingDoc.resolvedAt = resolvedAt || Date.now();
  bookingDoc.status = status;

  await bookingDoc.save();

  return res
    .status(200)
    .json(new ApiResponse(200, bookingDoc, "Booking resolved successfully"));
});

// Get user's bookings
const getMyBookings = asyncHandler(async (req, res) => {
  const { userBookings } = await User.findById(req.user.id).populate({
    path: "userBookings",
    options: { sort: { createdAt: -1 } },
    populate: {
      path: "owner",
      model: "User",
      select: "username email",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, userBookings, "Bookings fetched successfully"));
});

// Get received bookings (for owners)
const getReceivedBookings = asyncHandler(async (req, res) => {
  const { receivedBookings } = await User.findById(req.user.id).populate({
    path: "receivedBookings",
    options: { sort: { createdAt: -1 } },
    populate: {
      path: "booker",
      model: "User",
      select: "username email",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        receivedBookings,
        "Received bookings fetched successfully"
      )
    );
});

export { createBooking, resolveBooking, getMyBookings, getReceivedBookings };
