import mongoose, { Schema } from "mongoose";

/** Customer inquiry from the Help page contact form */
const supportMessageSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    contact: { type: String, required: true, maxlength: 120 },
    message: { type: String, required: true, maxlength: 2000 },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    status: { type: String, enum: ["NEW", "RESOLVED"], default: "NEW" },
  },
  { timestamps: true }
);

supportMessageSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("SupportMessage", supportMessageSchema);
