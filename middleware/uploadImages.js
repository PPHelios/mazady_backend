import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} from "../config/env.config.js";

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dp1nnka4y",
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

export const uploadImagesMiddleware = async (req, res, next) => {
  // Retrieve uploaded files
  // console.log(req.files);
  // console.log(req.body);
  const images = req.files ?? [];
  if (!images || images.length === 0) {
    res.status(400).json({ message: "No files uploaded" });
    return;
  }

  const errors = [];

  // Validate file types and sizes
  images.forEach((file) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`Invalid file type: ${file.originalname}`);
    }

    if (file.size > maxSize) {
      errors.push(`File too large: ${file.originalname}`);
    }
  });

  // Handle validation errors
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  const imagePromises = [];
  images.forEach(async (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;
    imagePromises.push(
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: "mazady",
          resource_type: "auto"
        },
        function (error, result) {
          // console.log(result, error);
        }
      )
    );
  });
  const uploadedImages = await Promise.all(imagePromises);

  const imageUrls = uploadedImages.map((image) => image.secure_url);
  req.body.imageUrls = imageUrls;
  next();
};
