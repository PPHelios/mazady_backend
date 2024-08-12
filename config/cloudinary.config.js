import { v2 } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "./env.config.js";

// Configuration
const cloudinary = v2.config({
  cloud_name: "dp1nnka4y",
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

export default cloudinary;
