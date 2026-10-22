import mongoose, { Schema } from "mongoose";

/**
 * One-time tokens for password reset and email verification.
 * Only a SHA-256 hash is stored, so a database leak does not expose usable links.
 * MongoDB deletes expired tokens automatically (TTL index).
 */
const accountTokenSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    type: { type: String, enum: ["RESET", "VERIFY"], required: true },
    tokenHash: { type: String, required: true, index: { unique: true } },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

accountTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
accountTokenSchema.index({ memberId: 1, type: 1 });

export default mongoose.model("AccountToken", accountTokenSchema);
