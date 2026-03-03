import validator from 'validator';

const BLOCKED_PROTOCOLS = ['javascript:', 'file:', 'data:', 'vbscript:', 'about:'];
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
const PRIVATE_IP_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^fc00:/i,
  /^fe80:/i
];

export function validateUrl(req, res, next) {
  const { target } = req.body;

  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'Target URL is required' });
  }

  const trimmedTarget = target.trim();

  if (!validator.isURL(trimmedTarget, {
    protocols: ['http', 'https'],
    require_protocol: true
  })) {
    return res.status(400).json({ error: 'Invalid URL format. Must be HTTP or HTTPS' });
  }

  const lowerTarget = trimmedTarget.toLowerCase();
  for (const protocol of BLOCKED_PROTOCOLS) {
    if (lowerTarget.startsWith(protocol)) {
      return res.status(400).json({ error: 'Blocked protocol detected' });
    }
  }

  let hostname;
  try {
    const url = new URL(trimmedTarget);
    hostname = url.hostname.toLowerCase();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (BLOCKED_HOSTS.includes(hostname)) {
    return res.status(400).json({ error: 'Localhost URLs are not allowed' });
  }

  for (const pattern of PRIVATE_IP_RANGES) {
    if (pattern.test(hostname)) {
      return res.status(400).json({ error: 'Private IP addresses are not allowed' });
    }
  }

  req.body.target = trimmedTarget;
  next();
}
