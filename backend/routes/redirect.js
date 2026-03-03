import express from 'express';
import Link from '../models/Link.js';
import { redirectLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/:code', redirectLimiter, async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOneAndUpdate(
      { code, deleted: false },
      {
        $inc: { clicks: 1 },
        lastClick: new Date()
      },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({ error: 'Link not found or has been deleted' });
    }

    res.redirect(302, link.target);

  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
