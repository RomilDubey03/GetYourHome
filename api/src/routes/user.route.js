import express from "express";
import {
  updateUserInfo,
  deleteUser,
  getUserListings,
  getUser,
  saveListing,
  getSavedListings,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/update/:id", verifyToken, upload.single("image"), updateUserInfo);
router.post("/save/:listingId", verifyToken, saveListing);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/saved/listings", verifyToken, getSavedListings);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", getUser);

export default router;
