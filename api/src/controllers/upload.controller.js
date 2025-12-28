import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Upload single image
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const result = await uploadOnCloudinary(req.file.path);

  if (!result) {
    throw new ApiError(500, "Failed to upload image to Cloudinary");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: result.secure_url,
        public_id: result.public_id,
      },
      "Image uploaded successfully"
    )
  );
});

// Upload multiple images
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  const uploadPromises = req.files.map((file) => uploadOnCloudinary(file.path));
  const results = await Promise.all(uploadPromises);

  const uploadedImages = results
    .filter((result) => result !== null)
    .map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

  if (uploadedImages.length === 0) {
    throw new ApiError(500, "Failed to upload images to Cloudinary");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { images: uploadedImages },
        `${uploadedImages.length} images uploaded successfully`
      )
    );
});

export { uploadImage, uploadImages };
