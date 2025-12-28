import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadImage, uploadImages } from "../controllers/upload.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Single image upload
router.post("/single", verifyToken, upload.single("image"), uploadImage);

// Multiple images upload (max 6)
router.post("/multiple", verifyToken, upload.array("images", 6), uploadImages);

export default router;
