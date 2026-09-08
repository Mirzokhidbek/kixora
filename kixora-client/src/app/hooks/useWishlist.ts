import { useState, useEffect } from "react";
import type { Product } from "../../lib/types/product";
import { sweetTopSmallSuccessAlert } from "../../lib/sweetAlert";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("kixora_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("kixora_wishlist", JSON.stringify(wishlist));
    } catch (err) {
      console.error("Error saving wishlist:", err);
    }
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p._id === product._id)) return prev;
      return [...prev, product];
    });
    sweetTopSmallSuccessAlert(`Saved "${product.productName}" to your Wishlist ❤️`);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
  };

  const toggleWishlist = (product: Product) => {
    if (wishlist.some((p) => p._id === product._id)) {
      removeFromWishlist(product._id);
      sweetTopSmallSuccessAlert(`Removed from Wishlist`);
      return false; // Removed
    } else {
      addToWishlist(product);
      return true; // Added
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p._id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return {
    wishlist,
    wishlistCount: wishlist.length,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
}
