import mongoose, { Schema } from "mongoose";

/** Newsletter subscriber (one row per email; unsubscribing keeps the row with a date) */
const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: { unique: true } },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Subscriber", subscriberSchema);
