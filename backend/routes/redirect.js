import express from "express";
import Link from "../models/Link.js";
import { redirectLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/*
  REDIRECT SHORT URL
  Example:
  https://your-backend.onrender.com/r/abc123
*/
router.get("/:code", redirectLimiter, async (req, res) => {
  try {
    const { code } = req.params;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Invalid code" });
    }

    const link = await Link.findOneAndUpdate(
      { code, deleted: false },
      {
        $inc: { clicks: 1 },
        $set: { lastClick: new Date() }
      },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({
        error: "Link not found or has been deleted"
      });
    }

    // Extra safety: prevent open redirect attacks
    if (!link.target.startsWith("http://") && !link.target.startsWith("https://")) {
      return res.status(400).json({
        error: "Invalid redirect URL"
      });
    }

    // Permanent redirect is better for SEO (optional)
    return res.redirect(302, link.target);

  } catch (error) {
    console.error("Error redirecting:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;