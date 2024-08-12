import express from "express";
import refreshAccessToken from "../middleware/refreshAccessToken.js";
import { Verify } from "../middleware/verify.js";
import {
  addItem,
  editUserProfile,
  getUserAds,
  getUserProfile
} from "../controllers/user.js";
import { rateLimiterMiddleware } from "../middleware/rateLimiter.js";
import { check } from "express-validator";
import {
  addItemSchema,
  editProfileSchema,
  editProfileWithPasswordSchema
} from "../config/zod.schemas.js";
import { validateData } from "../middleware/validate.js";
import { uploadImagesMiddleware } from "../middleware/uploadImages.js";
import { upload } from "../utils/multer.util.js";

const router = express.Router();

router.use(refreshAccessToken);
router.use(Verify);

// Add new item route == POST request
// max 10 images
router.post(
  "/addItem",
  upload.array("images", 10),
  uploadImagesMiddleware,
  check("item_name").escape(),
  check("item_desc").escape(),
  validateData(addItemSchema),
  addItem
);

// Get Ads route == GET request
router.get("/myAds", getUserAds);

// Get profile route == GET request
router.get("/profile", getUserProfile);

// Edit profile route == PATCH request
router.patch(
  "/editProfile",
  rateLimiterMiddleware,
  check("email").normalizeEmail(),
  check("first_name").escape(),
  check("last_name").escape(),
  validateData(editProfileSchema),
  editUserProfile
);

// Edit profile with password route == PATCH request
router.patch(
  "/editProfileWithPassword",
  rateLimiterMiddleware,
  check("email").normalizeEmail(),
  check("first_name").escape(),
  check("last_name").escape(),
  validateData(editProfileWithPasswordSchema),
  editUserProfile
);

export default router;
