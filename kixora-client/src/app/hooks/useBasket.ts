/**
 * ============================================================================
 * useBasket.ts - Shopping Basket & Footwear Variant State Hook
 * ============================================================================
 * Manages persistent localStorage shopping cart items including footwear
 * size (EU 38-45) and color variants, with automated SweetAlert2 notifications.
 */

import { useState, useEffect, useCallback } from "react";
import type { CartItem } from "../../lib/types/cart";
import type { Product } from "../../lib/types/product";
import { sweetErrorAlert, sweetTopSuccessAlert } from "../../lib/sweetAlert";
import ProductService from "../services/ProductService";
import { availableFor } from "../../lib/stock";

const productService = new ProductService();

/**
 * Re-checks bag items against the catalog: removes products that are no longer
 * sold or are out of stock, applies current prices and caps quantities.
 * Returns the updated items and human-readable notes about what changed.
 */
export async function reconcileCart(items: CartItem[]): Promise<{ items: CartItem[]; notes: string[] }> {
  if (!items.length) return { items, notes: [] };
  const ids = [...new Set(items.map((i) => i._id))];
  const products = await productService.getProductsBatch(ids);
  const byId = new Map(products.map((p) => [p._id, p]));
  const notes: string[] = [];
  const next: CartItem[] = [];

  for (const item of items) {
    const product = byId.get(item._id);
    if (!product) {
      notes.push(`"${item.name}" is no longer available and was removed.`);
      continue;
    }
    const available = availableFor(product, item.size);
    if (available < 1) {
      notes.push(`"${item.name}"${item.size ? ` (EU ${item.size})` : ""} is sold out and was removed.`);
      continue;
    }
    const updated = { ...item, name: product.productName, image: product.productImages?.[0] || item.image };
    if (product.productPrice !== item.price) {
      notes.push(`"${item.name}" price changed from $${item.price.toFixed(2)} to $${product.productPrice.toFixed(2)}.`);
      updated.price = product.productPrice;
    }
    if (item.quantity > available) {
      notes.push(`Only ${available} of "${item.name}"${item.size ? ` (EU ${item.size})` : ""} left; quantity reduced.`);
      updated.quantity = available;
    }
    next.push(updated);
  }
  return { items: next, notes };
}

export function useBasket() {
  const cartJson: string | null = localStorage.getItem("cart_items");
  const currentCart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
  const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  /** Brings the bag in line with the catalog; returns what changed (empty = nothing) */
  const syncCart = useCallback(async (): Promise<string[]> => {
    const current: CartItem[] = JSON.parse(localStorage.getItem("cart_items") || "[]");
    try {
      const { items, notes } = await reconcileCart(current);
      if (notes.length) setCartItems(items);
      return notes;
    } catch {
      return []; // offline etc.: the server still validates price and stock at checkout
    }
  }, []);

  // A bag saved days ago may hold old prices: refresh it once when the app loads
  useEffect(() => {
    syncCart().then((notes) => {
      if (notes.length) sweetErrorAlert(`Your bag was updated:\n${notes.join("\n")}`);
    });
  }, [syncCart]);

  const onAdd = (
    product: Product,
    quantity: number = 1,
    size?: number,
    color?: string
  ) => {
    const chosenSize = size || product.productSizes?.[0] || 42;
    const chosenColor = color || product.productColors?.[0] || "Standard";
    const cartItemId = `${product._id}_${chosenSize}_${chosenColor}`;

    const exist: CartItem | undefined = cartItems.find(
      (item: CartItem) => (item.cartItemId || item._id) === cartItemId || (item._id === product._id && item.size === chosenSize)
    );

    const available = availableFor(product, chosenSize);
    if (available < 1 || (exist && exist.quantity >= available)) {
      sweetErrorAlert(available < 1 ? "This size is sold out." : `Only ${available} left in this size.`);
      return;
    }

    if (exist) {
      const data: CartItem[] = cartItems.map((item: CartItem) =>
        (item.cartItemId || item._id) === (exist.cartItemId || exist._id)
          ? { ...exist, quantity: Math.min(available, exist.quantity + quantity) }
          : item
      );
      setCartItems(data);
    } else {
      const newItem: CartItem = {
        _id: product._id,
        cartItemId,
        quantity: Math.min(available, quantity),
        name: product.productName,
        price: product.productPrice,
        image: product.productImages?.[0] || "",
        size: chosenSize,
        color: chosenColor,
      };
      setCartItems([...cartItems, newItem]);
    }

    sweetTopSuccessAlert(`Added ${product.productName} (EU ${chosenSize}) to your bag!`);
  };

  const onRemove = (input: CartItem) => {
    const targetKey = input.cartItemId || input._id;
    const exist: CartItem | undefined = cartItems.find(
      (item: CartItem) => (item.cartItemId || item._id) === targetKey
    );

    if (exist?.quantity === 1) {
      const data: CartItem[] = cartItems.filter(
        (item: CartItem) => (item.cartItemId || item._id) !== targetKey
      );
      setCartItems(data);
    } else if (exist) {
      const data: CartItem[] = cartItems.map((item: CartItem) =>
        (item.cartItemId || item._id) === targetKey
          ? { ...exist, quantity: exist.quantity - 1 }
          : item
      );
      setCartItems(data);
    }
  };

  const onDelete = (input: CartItem) => {
    const targetKey = input.cartItemId || input._id;
    const data: CartItem[] = cartItems.filter(
      (item: CartItem) => (item.cartItemId || item._id) !== targetKey
    );
    setCartItems(data);
  };

  const onDeleteAll = () => {
    setCartItems([]);
    localStorage.removeItem("cart_items");
  };

  return {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    syncCart,
  };
}
