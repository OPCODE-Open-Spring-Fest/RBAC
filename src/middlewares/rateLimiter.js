import { MAX_REQUESTS, WINDOW_MS } from '../config/rateLimiter.js';

// Basic in-memory store
const requests = {};

export default function rateLimiter(req, res, next) {
  const now = Date.now();
  const ip = req.ip;

  if (!requests[ip]) requests[ip] = [];

  // Remove timestamps older than 1 minute
  requests[ip] = requests[ip].filter(ts => now - ts < WINDOW_MS);

  if (requests[ip].length >= MAX_REQUESTS) {
    return res.status(429).send('Too many requests, please try again later.');
  }

  requests[ip].push(now);
  next();
}
