import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

// Verify JWT token middleware
export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Unauthorized - Invalid token");
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(403, "Forbidden - Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Unauthorized - Token expired"));
    }
    next(error);
  }
};

// Alias for backward compatibility
export const isLoggedIn = verifyToken;

export default verifyToken;
