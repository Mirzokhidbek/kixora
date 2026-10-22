import { Response } from "express";

/**
 * Sends a tiny HTML page that shows an alert and redirects (admin EJS flow).
 * Values are JSON-encoded and "<" is escaped, so a message can never break out
 * of the <script> block (prevents reflected XSS).
 */
export function sendAdminAlert(res: Response, message: string, redirectTo: string, status = 200) {
  const safe = (v: string) => JSON.stringify(v).replace(/</g, "\\u003c");
  res
    .status(status)
    .type("html")
    .send(`<script>alert(${safe(message)}); window.location.replace(${safe(redirectTo)});</script>`);
}
