import { Request, Response, NextFunction } from "express";

/**
 * In-place recursive sanitizer to prevent NoSQL Injection attacks.
 * Removes keys starting with '$' or containing '.' without reassigning getter properties.
 * 100% compatible with Express 5.
 */
function sanitizeInPlace(target: any): void {
  if (!target || typeof target !== "object") return;

  if (Array.isArray(target)) {
    target.forEach((item) => sanitizeInPlace(item));
    return;
  }

  for (const key of Object.keys(target)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete target[key];
    } else if (typeof target[key] === "object" && target[key] !== null) {
      sanitizeInPlace(target[key]);
    }
  }
}

export const noSqlSanitizer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body) sanitizeInPlace(req.body);
  if (req.params) sanitizeInPlace(req.params);
  if (req.query) sanitizeInPlace(req.query);
  next();
};
