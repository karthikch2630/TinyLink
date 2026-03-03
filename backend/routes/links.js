import express from 'express';
import Link from '../models/Link.js';
import { generateCode } from '../utils/codeGen.js';
import { validateUrl } from '../middleware/validateUrl.js';
import { createLinkLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', createLinkLimiter, validateUrl, async (req, res) => {
  try {
    const { target, code } = req.body;

    let shortCode = code;

    if (shortCode) {
      if (typeof shortCode !== 'string' || shortCode.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid custom code' });
      }

      shortCode = shortCode.trim();

      if (!/^[a-zA-Z0-9]+$/.test(shortCode)) {
        return res.status(400).json({ error: 'Code must be alphanumeric' });
      }

      if (shortCode.length > 50) {
        return res.status(400).json({ error: 'Code too long (max 50 characters)' });
      }

      const existing = await Link.findOne({ code: shortCode });
      if (existing) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        shortCode = generateCode(6);
        const existing = await Link.findOne({ code: shortCode });
        if (!existing) break;
        attempts++;
      }

      if (attempts === maxAttempts) {
        return res.status(500).json({ error: 'Failed to generate unique code' });
      }
    }

    const link = new Link({
      code: shortCode,
      target,
      clicks: 0,
      deleted: false
    });

    await link.save();

    res.status(201).json({
      code: link.code,
      target: link.target,
      createdAt: link.createdAt,
      clicks: link.clicks,
      lastClick: link.lastClick,
      deleted: link.deleted,
      shortUrl: `${process.env.BASE_URL}/r/${link.code}`
    });

  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const links = await Link.find({ deleted: false })
      .sort({ createdAt: -1 })
      .select('code target createdAt clicks lastClick deleted');

    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOne({ code, deleted: false });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({
      code: link.code,
      target: link.target,
      createdAt: link.createdAt,
      clicks: link.clicks,
      lastClick: link.lastClick,
      deleted: link.deleted
    });

  } catch (error) {
    console.error('Error fetching link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOneAndUpdate(
      { code, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Link deleted successfully' });

  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
