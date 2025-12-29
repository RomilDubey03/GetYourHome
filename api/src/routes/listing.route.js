import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  saveListingToggle,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, upload.single("image"), createListing);
router.post("/save/:id", verifyToken, saveListingToggle);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, upload.single("image"), updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
