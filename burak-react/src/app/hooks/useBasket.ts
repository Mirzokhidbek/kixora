import { useState, useEffect } from "react";
import type { CartItem } from "../../lib/types/cart";
import type { Product } from "../../lib/types/product";

export function useBasket() {
  const cartJson: string | null = localStorage.getItem("cart_items");
  const currentCart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
  const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  const onAdd = (product: Product, quantity: number = 1) => {
    const exist: CartItem | undefined = cartItems.find(
      (item: CartItem) => item._id === product._id
    );

    if (exist) {
      const data: CartItem[] = cartItems.map((item: CartItem) =>
        item._id === product._id
          ? { ...exist, quantity: exist.quantity + quantity }
          : item
      );
      setCartItems(data);
    } else {
      const newItem: CartItem = {
        _id: product._id,
        quantity: quantity,
        name: product.productName,
        price: product.productPrice,
        image: product.productImages?.[0] || "",
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const onRemove = (input: CartItem) => {
    const exist: CartItem | undefined = cartItems.find(
      (item: CartItem) => item._id === input._id
    );

    if (exist?.quantity === 1) {
      const data: CartItem[] = cartItems.filter(
        (item: CartItem) => item._id !== input._id
      );
      setCartItems(data);
    } else if (exist) {
      const data: CartItem[] = cartItems.map((item: CartItem) =>
        item._id === input._id
          ? { ...exist, quantity: exist.quantity - 1 }
          : item
      );
      setCartItems(data);
    }
  };

  const onDelete = (input: CartItem) => {
    const data: CartItem[] = cartItems.filter(
      (item: CartItem) => item._id !== input._id
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
