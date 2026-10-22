import { OrderStatus } from "./enums/order.enum";

/**
 * Pure order business rules, kept free of DB access so they are unit-testable.
 */

export const FREE_DELIVERY_THRESHOLD = 100;
export const DELIVERY_FEE = 5;
export const POINTS_PER_DOLLARS = 10; // 1 loyalty point per $10 spent

/** Status changes a customer may make on their own order */
const MEMBER_TRANSITIONS: Record<string, OrderStatus[]> = {
  [OrderStatus.PAUSE]: [OrderStatus.PROCESS, OrderStatus.DELETE], // pay or cancel
  [OrderStatus.PROCESS]: [OrderStatus.FINISH], // confirm receipt
};

/** Status changes the store admin may make */
const ADMIN_TRANSITIONS: Record<string, OrderStatus[]> = {
  [OrderStatus.PAUSE]: [OrderStatus.PROCESS, OrderStatus.DELETE],
  [OrderStatus.PROCESS]: [OrderStatus.FINISH, OrderStatus.DELETE],
};

/** Returns the statuses an order may be moved FROM to reach `to` */
export function allowedSourceStatuses(to: OrderStatus, actor: "member" | "admin"): OrderStatus[] {
  const table = actor === "admin" ? ADMIN_TRANSITIONS : MEMBER_TRANSITIONS;
  return Object.keys(table).filter((from) => table[from].includes(to)) as OrderStatus[];
}

export function canTransition(from: OrderStatus, to: OrderStatus, actor: "member" | "admin"): boolean {
  return allowedSourceStatuses(to, actor).includes(from);
}

const roundMoney = (n: number) => Math.round(n * 100) / 100;

/** Computes order totals from SERVER-side product prices */
export function calculateTotals(items: { price: number; quantity: number }[]) {
  const subtotal = roundMoney(items.reduce((acc, i) => acc + i.price * i.quantity, 0));
  const delivery = subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  return { subtotal, delivery, total: roundMoney(subtotal + delivery) };
}

export function pointsForTotal(total: number): number {
  return Math.round(total / POINTS_PER_DOLLARS);
}

/** Merges duplicate product lines so stock is checked once per product */
export function mergeOrderLines<T extends { productId: string; itemQuantity: number }>(lines: T[]) {
  const merged = new Map<string, number>();
  for (const l of lines) merged.set(l.productId, (merged.get(l.productId) || 0) + l.itemQuantity);
  return [...merged.entries()].map(([productId, itemQuantity]) => ({ productId, itemQuantity }));
}
