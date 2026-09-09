import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

/**
 * 1. Global API Rate Limiter
 * Limits each IP to 300 requests per 15-minute window
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    code: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

/**
 * 2. Strict Authentication Limiter (User Login & Signup)
 * Protects against brute-force password guessing and bot registrations.
 * Limits each IP to 15 attempts per 15-minute window.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    message: "Too many login/signup attempts from this IP. Please try again in 15 minutes.",
  },
});

/**
 * 3. Strict Admin Authentication Limiter
 * Protects executive admin portal against brute-force attacks.
 * Limits each IP to 10 attempts per 15-minute window.
 */
export const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).send(`
      <script>
        alert("Too many admin login attempts from this IP! For security, your access is paused for 15 minutes.");
        window.location.replace('/admin/login');
      </script>
    `);
  },
});

/**
 * 4. Order & Checkout Limiter
 * Protects order creation from automated checkout spam.
 * Limits each IP to 10 orders per 1 minute window.
 */
export const orderLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    message: "Order creation rate limit reached. Please wait a moment before trying again.",
  },
});
