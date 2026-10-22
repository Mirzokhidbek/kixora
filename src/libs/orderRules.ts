import { OrderStatus } from "./enums/order.enum";

/**
 * Pure order business rules, kept free of DB access so they are unit-testable.
 */

export const FREE_DELIVERY_THRESHOLD = 100;
export const DELIVERY_FEE = 5;
export const POINTS_PER_DOLLARS = 10; // 1 loyalty point per $10 spent

export type OrderActor = "member" | "admin" | "payment";

/**
 * Status changes a customer may make on their own order.
 * A customer can NOT mark an order as paid: PAUSE → PROCESS only happens
 * through a confirmed payment ("payment" actor) or the admin.
 */
const MEMBER_TRANSITIONS: Record<string, OrderStatus[]> = {
  [OrderStatus.PAUSE]: [OrderStatus.DELETE], // cancel before paying
  [OrderStatus.PROCESS]: [OrderStatus.FINISH], // confirm receipt
};

/** A confirmed payment moves an unpaid order into processing */
const PAYMENT_TRANSITIONS: Record<string, OrderStatus[]> = {
  [OrderStatus.PAUSE]: [OrderStatus.PROCESS],
};

/** Status changes the store admin may make (PAUSE → PROCESS records a manual payment) */
const ADMIN_TRANSITIONS: Record<string, OrderStatus[]> = {
  [OrderStatus.PAUSE]: [OrderStatus.PROCESS, OrderStatus.DELETE],
  [OrderStatus.PROCESS]: [OrderStatus.FINISH, OrderStatus.DELETE],
};

const TABLES: Record<OrderActor, Record<string, OrderStatus[]>> = {
  member: MEMBER_TRANSITIONS,
  admin: ADMIN_TRANSITIONS,
  payment: PAYMENT_TRANSITIONS,
};

/** Returns the statuses an order may be moved FROM to reach `to` */
export function allowedSourceStatuses(to: OrderStatus, actor: OrderActor): OrderStatus[] {
  const table = TABLES[actor];
  return Object.keys(table).filter((from) => table[from].includes(to)) as OrderStatus[];
}

export function canTransition(from: OrderStatus, to: OrderStatus, actor: OrderActor): boolean {
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

/** Total quantity per product, so stock is checked and reserved once per product */
export function mergeOrderLines<T extends { productId: string; itemQuantity: number }>(lines: T[]) {
  const merged = new Map<string, number>();
  for (const l of lines) merged.set(l.productId, (merged.get(l.productId) || 0) + l.itemQuantity);
  return [...merged.entries()].map(([productId, itemQuantity]) => ({ productId, itemQuantity }));
}

/** Order lines merged per (product, size): two sizes of one model stay separate lines */
export function mergeOrderLinesBySize<T extends { productId: string; itemQuantity: number; itemSize?: number }>(
  lines: T[]
) {
  const merged = new Map<string, { productId: string; itemQuantity: number; itemSize?: number }>();
  for (const l of lines) {
    const key = `${l.productId}:${l.itemSize ?? ""}`;
    const prev = merged.get(key);
    merged.set(key, { productId: l.productId, itemSize: l.itemSize, itemQuantity: (prev?.itemQuantity || 0) + l.itemQuantity });
  }
  return [...merged.values()];
}
