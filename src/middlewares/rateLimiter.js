import { MAX_REQUESTS, WINDOW_MS } from '../config/rateLimiter.js';
import ApiError from '../utils/ApiError.js';
// Basic in-memory store
const requests = {};

export default function rateLimiter(req, res, next) {
  try{
  const now = Date.now();
  const ip = req.ip;

  if (!requests[ip]) requests[ip] = [];

  // Remove timestamps older than 1 minute
  requests[ip] = requests[ip].filter(ts => now - ts < WINDOW_MS);

  if (requests[ip].length >= MAX_REQUESTS) {
    return next(new ApiError(429, 'Too many requests, please try again later.'));
  }

  requests[ip].push(now);
  next();
  } catch (error) {
    next(new ApiError(500, 'Rate limiter error'));
  }
}
