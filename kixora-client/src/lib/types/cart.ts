/**
 * ============================================================================
 * cart.ts - Shopping Basket Line Item Definitions
 * ============================================================================
 * Defines customer cart items with footwear specifications (size, color, qty).
 */

export interface CartItem {
  _id: string;
  cartItemId?: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  size?: number;
  color?: string;
}
