import type { PaymentMethod } from "../../services/PaymentService";

/** Customer-facing text for each payment method */
export const PAYMENT_TEXT: Record<PaymentMethod, { title: string; caption: string }> = {
  TEST: {
    title: "Test payment (demo)",
    caption: "Simulated payment for testing. No card is charged and no money moves.",
  },
  MANUAL: {
    title: "Pay on delivery / bank transfer",
    caption: "Your order is reserved. The store confirms it once your payment is received.",
  },
};

export const paymentMethodLabel = (method: PaymentMethod | null) => (method ? PAYMENT_TEXT[method].title : "");
