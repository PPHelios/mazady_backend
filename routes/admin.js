import express from "express";
import refreshAccessToken from "../middleware/refreshAccessToken.js";
import { Verify, VerifyRole } from "../middleware/verify.js";
import { getAllAds } from "../controllers/admin.js";
import { rateLimiterMiddleware } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(refreshAccessToken);
router.use(rateLimiterMiddleware);
router.use(Verify);

router.get("/allAds", getAllAds);
router.get("/admin", VerifyRole, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Admin portal!"
  });
});

export default router;
