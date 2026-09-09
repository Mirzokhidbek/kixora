import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Helper to check if request originates from localhost / dev environment
 */
const isLocalhost = (req: Request): boolean => {
  if (isProduction) return false;
  const ip = req.ip || req.socket.remoteAddress || "";
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "::ffff:127.0.0.1" ||
    req.hostname === "localhost" ||
    req.headers.host?.startsWith("localhost") === true
  );
};

/**
 * 1. Global API Rate Limiter
 * Generous limits for high-performance eCommerce shopping while protecting against DDoS
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 1500 : 25000,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req: Request) => isLocalhost(req),
  message: {
    code: 429,
    message: "Too many requests from this IP, please try again after a moment.",
  },
});

/**
 * 2. Strict Authentication Limiter (User Login & Signup)
 * Protects against brute-force password guessing and bot registrations.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 25 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => isLocalhost(req),
  message: {
    code: 429,
    message: "Too many login/signup attempts from this IP. Please try again in 15 minutes.",
  },
});

/**
 * 3. Strict Admin Authentication Limiter
 * Protects executive admin portal against brute-force attacks.
 */
export const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 15 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => isLocalhost(req),
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
 */
export const orderLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: isProduction ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => isLocalhost(req),
  message: {
    code: 429,
    message: "Order creation rate limit reached. Please wait a moment before trying again.",
  },
});

