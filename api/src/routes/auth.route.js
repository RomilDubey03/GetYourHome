import express from "express";
import {
  signup,
  signin,
  google,
  signOut,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/register", signup); // Alias for CodeCraft compatibility
router.post("/login", signin); // Alias for CodeCraft compatibility
router.post("/google", google);
router.get("/signout", signOut);
router.post("/logout", signOut); // Alias for CodeCraft compatibility
router.get("/check", verifyToken, getCurrentUser); // Check auth status

export default router;
