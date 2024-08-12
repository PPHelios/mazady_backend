import express from "express";
import { Register, Login, Logout } from "../controllers/auth.js";
import { check } from "express-validator";
import { validateData } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../config/zod.schemas.js";
import { rateLimiterMiddleware } from "../middleware/rateLimiter.js";

const router = express.Router();

// Rate limit access to these API's
router.use(rateLimiterMiddleware);

// Register route -- POST request
router.post(
  "/register",
  check("email").normalizeEmail(),
  check("first_name").escape(),
  check("last_name").escape(),
  validateData(signupSchema),
  Register
);
// Login route == POST request
router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  check("password").not().isEmpty(),
  validateData(loginSchema),
  Login
);
// Logout route == GET request
router.get("/logout", Logout);

export default router;
