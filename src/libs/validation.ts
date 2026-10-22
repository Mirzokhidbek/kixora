import { z } from "zod";
import mongoose from "mongoose";
import { MemberStatus } from "./enums/member.enum";
import { OrderStatus } from "./enums/order.enum";
import { ReviewStatus } from "./enums/review.enum";
import { ProductCollection, ProductSize, ProductStatus } from "./enums/product.enum";
import Errors, { HTTPCode } from "./Errors";

/**
 * Request validation schemas.
 * Every schema is a WHITELIST: unknown keys are stripped, so clients can never
 * set privileged fields such as memberType, memberPoints or orderTotal.
 */

const objectId = z
  .string()
  .refine((v) => mongoose.Types.ObjectId.isValid(v), "Invalid id format");

const trimmed = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();

/** Multipart/form fields arrive as strings, so numbers are coerced */
const intFromForm = (min: number, max: number) => z.coerce.number().int().min(min).max(max);

// ---------- Member ----------
export const signupSchema = z.object({
  memberNick: trimmed(2, 40),
  memberEmail: z.string().trim().toLowerCase().email().max(120).optional(),
  memberPhone: optionalText(30),
  memberPassword: z.string().min(6).max(128),
});

export const loginSchema = z
  .object({
    memberEmail: z.string().trim().max(120).optional(),
    memberNick: z.string().trim().max(120).optional(),
    memberPassword: z.string().min(1).max(128),
  })
  .refine((v) => Boolean(v.memberEmail || v.memberNick), "Login identifier is required");

export const googleLoginSchema = z.object({
  credential: z.string().min(20).max(5000),
});

export const memberUpdateSchema = z.object({
  memberNick: trimmed(2, 40).optional(),
  memberPhone: optionalText(30),
  memberAddress: optionalText(300),
  memberDesc: optionalText(1000),
});

export const adminSignupSchema = z.object({
  memberNick: trimmed(2, 40),
  memberPhone: trimmed(3, 30),
  memberPassword: z.string().min(8).max(128),
});

export const adminLoginSchema = z.object({
  memberNick: trimmed(1, 40),
  memberPassword: z.string().min(1).max(128),
});

export const adminUserUpdateSchema = z.object({
  _id: objectId,
  memberStatus: z.nativeEnum(MemberStatus),
});

export const adminPointsSchema = z.object({
  points: z.coerce.number().int().min(0).max(1_000_000),
});

// ---------- Product ----------
const commaList = <T extends z.ZodTypeAny>(item: T) =>
  z.preprocess((v) => {
    if (v === undefined || v === "") return undefined;
    if (Array.isArray(v)) return v;
    return String(v).split(",").map((s) => s.trim()).filter(Boolean);
  }, z.array(item).max(20).optional());

export const productCreateSchema = z.object({
  productName: trimmed(1, 120),
  productPrice: z.coerce.number().min(0).max(100_000),
  productLeftCount: intFromForm(0, 1_000_000),
  productCollection: z.nativeEnum(ProductCollection),
  productStatus: z.nativeEnum(ProductStatus).optional(),
  productSize: z.nativeEnum(ProductSize).optional(),
  productDesc: optionalText(2000),
  productMaterial: optionalText(100),
  productMidsole: optionalText(100),
  productOutsole: optionalText(100),
  productWeight: optionalText(50),
  productSizes: commaList(z.coerce.number().min(10).max(60)),
  productColors: commaList(z.string().trim().min(1).max(30)),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productInquirySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(8),
  order: z.enum(["createdAt", "productViews", "productPrice", "productLikes", "ratingAvg"]).default("createdAt"),
  productCollection: z.nativeEnum(ProductCollection).optional(),
  search: z.string().trim().max(100).optional(),
  size: z.coerce.number().min(10).max(60).optional(),
  color: z.string().trim().max(30).optional(),
});

export const aiSearchSchema = z.object({
  query: trimmed(1, 300),
});

// ---------- Likes & Reviews ----------
/** Free text: trims, drops control characters (keeps newlines/tabs) */
const userText = (min: number, max: number) =>
  z
    .string()
    .transform((v) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().min(min).max(max));

export const likeSyncSchema = z.object({
  productIds: z.array(objectId).max(100),
});

export const reviewSaveSchema = z.object({
  reviewRating: z.coerce.number().int().min(1).max(5),
  reviewComment: userText(3, 1000),
});

export const reviewListSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(5),
});

export const adminReviewListSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  status: z.nativeEnum(ReviewStatus).optional(),
});

export const adminReviewStatusSchema = z.object({
  reviewStatus: z.nativeEnum(ReviewStatus),
});

export const adminReviewReplySchema = z.object({
  adminReply: userText(0, 1000),
});

// ---------- Order ----------
export const orderItemsSchema = z
  .array(
    z.object({
      productId: objectId,
      itemQuantity: z.coerce.number().int().min(1).max(20),
      itemSize: z.coerce.number().min(10).max(60).optional(),
    })
  )
  .min(1)
  .max(50);

export const shippingSchema = z.object({
  recipient: userText(2, 80),
  phone: z.string().trim().regex(/^\+?[0-9\s()-]{7,20}$/, "Invalid phone number"),
  address: userText(5, 300),
  note: userText(0, 300).optional(),
});

export const orderCreateSchema = z.object({
  items: orderItemsSchema,
  shipping: shippingSchema,
});

export const orderPaySchema = z.object({
  orderId: objectId,
});

export const orderInquirySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(5),
  orderStatus: z.nativeEnum(OrderStatus).default(OrderStatus.PAUSE),
});

export const orderUpdateSchema = z.object({
  orderId: objectId,
  orderStatus: z.nativeEnum(OrderStatus),
});

export const adminListSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
});

/** Parses input with a schema, converting validation failures into a 400 Errors */
export function parse<S extends z.ZodTypeAny>(schema: S, input: unknown): z.infer<S> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path.join(".");
    throw new Errors(
      HTTPCode.BAD_REQUEST,
      field ? `Invalid ${field}: ${issue.message}` : issue.message
    );
  }
  return result.data;
}
