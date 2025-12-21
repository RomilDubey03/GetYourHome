import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import UserRouter from "./routes/user.route.js";
import AuthRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import BookingRouter from "./routes/booking.route.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://get-your-home.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", UserRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/listing", listingRouter);
app.use("/api/booking", BookingRouter);

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "kuch to gadbad he daya";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`server running at : http://localhost:${PORT}`);
});

export default app;
