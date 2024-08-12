import express from "express";
import { findByCategory, findById } from "../controllers/search.js";

const router = express.Router();

router.post("/:category/:id", findById);
router.post("/:category", findByCategory);

export default router;