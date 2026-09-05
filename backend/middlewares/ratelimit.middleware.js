import rateLimit from "express-rate-limit";

// General limiter applied to all API traffic - guards against abuse/DoS
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP per window
  standardHeaders: true, // return RateLimit-* headers
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later",
    success: false
  }
});

// Stricter limiter for sensitive auth routes (login, register, refresh-token)
// to slow down brute-force / credential-stuffing attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failed attempts against the limit
  message: {
    message: "Too many attempts, please try again later",
    success: false
  }
});