import { FREE_DELIVERY_THRESHOLD } from "./pricing";

/**
 * Customer-facing store promises in one place.
 * Store owner: confirm these match your real policy before going live.
 */
export const STORE_INFO = {
  freeDeliveryFrom: FREE_DELIVERY_THRESHOLD,
  /** Days a customer may return unworn shoes (owner to confirm) */
  returnDays: 30,
  /** How payments work today (no online card payments yet) */
  paymentNote: "Pay on delivery or by bank transfer",
  supportNote: "Write to us from the Help page",
};
