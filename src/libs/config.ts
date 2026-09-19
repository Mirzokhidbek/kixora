import mongoose from "mongoose";

export const MORGAN_FORMAT = `:method :url :response-time ms [:status] \n`;

export const AUTH_TIMER = 24; // 24 hours

export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};
