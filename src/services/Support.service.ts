import crypto from "crypto";
import SupportMessageModel from "../models/SupportMessage.model";
import SubscriberModel from "../models/Subscriber.model";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { env, shapeIntoMongooseObjectId } from "../libs/config";
import { mailer } from "../libs/mailer";
import { logger } from "../libs/logger";

type SupportInput = { name: string; contact: string; message: string };
export type MessageStatus = "NEW" | "RESOLVED";

/** Signed token so only the link we send can unsubscribe an address */
export const unsubscribeToken = (email: string) =>
  crypto.createHmac("sha256", env.jwtSecret).update(`unsubscribe:${email.toLowerCase()}`).digest("hex");

class SupportService {
  private readonly messageModel = SupportMessageModel;
  private readonly subscriberModel = SubscriberModel;

  /** Stores a contact-form message and notifies the store when a notify address is set */
  public async createMessage(input: SupportInput, memberId?: string) {
    const doc = await this.messageModel.create({
      ...input,
      memberId: memberId ? shapeIntoMongooseObjectId(memberId) : undefined,
    });
    if (env.storeNotifyEmail) {
      mailer
        .send({
          to: env.storeNotifyEmail,
          subject: `New customer message from ${input.name}`,
          text: `From: ${input.name} <${input.contact}>\n\n${input.message}\n\nAdmin inbox: ${env.publicUrl}/admin/inbox`,
        })
        .catch((err) => logger.warn("Support notification email failed", { err }));
    }
    return { received: true, id: String(doc._id) };
  }

  /** Idempotent: subscribing twice (or after unsubscribing) just (re)activates the address */
  public async subscribe(email: string) {
    await this.subscriberModel
      .updateOne({ email }, { $set: { unsubscribedAt: null }, $setOnInsert: { email } }, { upsert: true })
      .exec();
    return { subscribed: true };
  }

  public async unsubscribe(email: string, token: string) {
    const expected = unsubscribeToken(email);
    const valid = token.length === expected.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
    if (!valid) throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_TOKEN);
    await this.subscriberModel.updateOne({ email }, { $set: { unsubscribedAt: new Date() } }).exec();
    return { unsubscribed: true };
  }

  // ---------- Admin ----------
  public async getMessages(page: number, limit: number, status?: MessageStatus) {
    const filter = status ? { status } : {};
    const [messages, total, newCount, subscriberCount] = await Promise.all([
      this.messageModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean().exec(),
      this.messageModel.countDocuments(filter).exec(),
      this.messageModel.countDocuments({ status: "NEW" }).exec(),
      this.subscriberModel.countDocuments({ unsubscribedAt: null }).exec(),
    ]);
    return { messages, total, newCount, subscriberCount };
  }

  public async setMessageStatus(id: string, status: MessageStatus) {
    const doc = await this.messageModel
      .findByIdAndUpdate(shapeIntoMongooseObjectId(id), { $set: { status } }, { new: true })
      .lean()
      .exec();
    if (!doc) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return doc;
  }

  /** Active subscribers as CSV (email, subscribed date, unsubscribe link) */
  public async subscribersCsv(): Promise<string> {
    const rows = await this.subscriberModel
      .find({ unsubscribedAt: null })
      .sort({ createdAt: -1 })
      .lean<{ email: string; createdAt: Date }[]>()
      .exec();
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = rows.map((r) =>
      [
        esc(r.email),
        esc(new Date(r.createdAt).toISOString()),
        esc(`${env.appUrl}/unsubscribe?email=${encodeURIComponent(r.email)}&token=${unsubscribeToken(r.email)}`),
      ].join(",")
    );
    return ["email,subscribed_at,unsubscribe_link", ...lines].join("\n");
  }
}

export default SupportService;
