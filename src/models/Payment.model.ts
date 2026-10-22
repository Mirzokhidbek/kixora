import mongoose, { Schema } from "mongoose";
import { PaymentMethod, PaymentStatus } from "../libs/enums/payment.enum";

/** Ledger of confirmed payments. Only the server creates these. */
const paymentSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, required: true, ref: "Order" },
    memberId: { type: Schema.Types.ObjectId, required: true, ref: "Member" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PAID },
    providerTxnId: { type: String, required: true },
    confirmedBy: { type: String, enum: ["provider", "admin"], required: true },
    paidAt: { type: Date, default: Date.now },
    refundedAt: { type: Date },
  },
  { timestamps: true }
);

// One payment per order: a second confirmation can never double-charge or double-count
paymentSchema.index({ orderId: 1 }, { unique: true });
paymentSchema.index({ memberId: 1, createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);
