import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

// Trust proxy for production (Vercel/Nginx)
app.set("trust proxy", 1);

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
      ];
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes Import
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/listings", listingRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "GetYourHome API is running!" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

import connectToDB from "./db/dbconnect.js";
import mongoose from "mongoose";

// Initialize database connection
try {
  await connectToDB();

  // Drop problematic unique index on saved field (one-time fix)
  try {
    await mongoose.connection.collection("users").dropIndex("saved_1");
    console.log("Dropped saved_1 index successfully");
  } catch (indexError) {
    // Index might not exist, which is fine
    if (indexError.code !== 27) {
      // 27 = index not found
      console.log("Index drop note:", indexError.message);
    }
  }
} catch (error) {
  console.error("Database connection failed during app initialization:", error);
  process.exit(1);
}

export default app;
