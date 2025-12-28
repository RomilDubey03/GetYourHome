import express from "express";
import {
  createBooking,
  resolveBooking,
  getMyBookings,
  getReceivedBookings,
} from "../controllers/booking.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/user-bookings", verifyToken, getMyBookings);
router.get("/received-bookings", verifyToken, getReceivedBookings);
router.post("/create", verifyToken, createBooking);
router.post("/resolve", verifyToken, resolveBooking);

export default router;
