/**
 * ============================================================================
 * useBasket.ts - Shopping Basket & Footwear Variant State Hook
 * ============================================================================
 * Manages persistent localStorage shopping cart items including footwear
 * size (EU 38-45) and color variants, with automated SweetAlert2 notifications.
 */

import { useState, useEffect } from "react";
import type { CartItem } from "../../lib/types/cart";
import type { Product } from "../../lib/types/product";
import { sweetTopSuccessAlert } from "../../lib/sweetAlert";

export function useBasket() {
  const cartJson: string | null = localStorage.getItem("cart_items");
  const currentCart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
  const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

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

    if (exist) {
      const data: CartItem[] = cartItems.map((item: CartItem) =>
        (item.cartItemId || item._id) === (exist.cartItemId || exist._id)
          ? { ...exist, quantity: exist.quantity + quantity }
          : item
      );
      setCartItems(data);
    } else {
      const newItem: CartItem = {
        _id: product._id,
        cartItemId,
        quantity,
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
  };
}
