import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { env } from "../libs/config";

/** Per-request nonce: only <script nonce="..."> blocks rendered by our views may run inline */
export const cspNonce = (_req: Request, res: Response, next: NextFunction) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("base64");
  next();
};

/**
 * Content-Security-Policy. Allows our own files, the CDNs the admin panel uses,
 * and nonce'd inline scripts; inline event handlers (onclick=...) are blocked.
 */
export const contentSecurityPolicy = helmet.contentSecurityPolicy({
  useDefaults: false,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      (_req, res) => `'nonce-${(res as Response).locals.cspNonce}'`,
      "https://cdn.jsdelivr.net",
      "https://code.jquery.com",
    ],
    scriptSrcAttr: ["'none'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
    imgSrc: ["'self'", "data:", "blob:", "https:"],
    connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'self'"],
    ...(env.isProduction ? { upgradeInsecureRequests: [] } : {}),
  },
});
