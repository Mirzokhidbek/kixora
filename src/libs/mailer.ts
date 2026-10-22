import nodemailer, { Transporter } from "nodemailer";
import { env } from "./config";
import { logger } from "./logger";

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
}

/**
 * Outgoing email.
 * With SMTP_URL (e.g. smtps://user:pass@smtp.example.com:465) mail is really sent.
 * Without it (development) the message is written to the log instead, so links
 * such as password resets can still be followed locally. In production a missing
 * SMTP_URL is reported as an error because customers would never get the email.
 */
let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.smtpUrl) return null;
  if (!transporter) transporter = nodemailer.createTransport(env.smtpUrl);
  return transporter;
}

/** NODE_ENV=test: messages are kept here instead of being sent (read by the E2E tests) */
export const testOutbox: MailMessage[] = [];

export const mailer = {
  async send(message: MailMessage): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      testOutbox.push(message);
      return;
    }
    const transport = getTransporter();
    if (!transport) {
      if (env.isProduction) {
        logger.error("Email not sent: SMTP_URL is not configured", { to: message.to, subject: message.subject });
      } else {
        logger.info("📧 [dev mail] " + message.subject, { to: message.to, text: message.text });
      }
      return;
    }
    await transport.sendMail({ from: env.mailFrom, ...message });
  },
};
