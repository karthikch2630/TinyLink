import rateLimit from 'express-rate-limit';

export const createLinkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many link creation requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

export const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Too many redirect requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});
