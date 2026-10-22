/**
 * Delivery rule shown in the UI. Must match the server (src/libs/orderRules.ts);
 * the server always recalculates the real total from catalog prices.
 */
export const FREE_DELIVERY_THRESHOLD = 100;
export const DELIVERY_FEE = 5;

export function calculateCartTotals(items: { price: number; quantity: number }[]) {
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
  const delivery = subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  return { subtotal, delivery, total: Math.round((subtotal + delivery) * 100) / 100 };
}
