import { useEffect, useSyncExternalStore } from "react";
import type { Product } from "../../lib/types/product";
import { sweetErrorAlert, sweetTopSmallSuccessAlert } from "../../lib/sweetAlert";
import ProductService from "../services/ProductService";
import { useGlobals } from "./useGlobals";

/**
 * Wishlist ("like") store shared by every component.
 *
 * - One module-level store: Navbar, product list and product page always see the
 *   same list (previously each component had its own copy and they drifted apart).
 * - Guests: kept in localStorage.
 * - Signed-in members: the server is the source of truth (likes are per account,
 *   with current prices). On sign-in the guest list is merged into the account;
 *   on sign-out the local copy is cleared so the next person doesn't see it.
 */

const STORAGE_KEY = "kixora_wishlist";
const productService = new ProductService();

type Listener = () => void;

function loadLocal(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let items: Product[] = loadLocal();
let syncedMemberId: string | null | undefined = undefined; // undefined = not resolved yet
const listeners = new Set<Listener>();

function setItems(next: Product[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error("Error saving wishlist:", err);
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => items;

/** Called on every auth change; idempotent per member id */
async function syncForMember(memberId: string | null) {
  if (syncedMemberId === memberId) return;
  const previous = syncedMemberId;
  syncedMemberId = memberId;

  if (!memberId) {
    // Signed out: the list belonged to the account, don't leak it to the next user
    if (previous) setItems([]);
    return;
  }
  try {
    const guestIds = items.map((p) => p._id);
    const serverList = guestIds.length
      ? await productService.syncLikes(guestIds)
      : await productService.getLikedProducts();
    if (syncedMemberId === memberId) setItems(serverList);
  } catch (err) {
    console.error("Wishlist sync failed:", err);
    syncedMemberId = previous; // retry on the next auth effect
  }
}

export function useWishlist() {
  const { authMember } = useGlobals();
  const wishlist = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const memberId = authMember?._id ?? null;

  useEffect(() => {
    void syncForMember(memberId);
  }, [memberId]);

  const isInWishlist = (productId: string) => wishlist.some((p) => p._id === productId);

  /** Optimistic toggle; reverted if the server rejects it */
  const toggleWishlist = (product: Product): boolean => {
    const before = items;
    const adding = !before.some((p) => p._id === product._id);
    setItems(adding ? [product, ...before] : before.filter((p) => p._id !== product._id));
    sweetTopSmallSuccessAlert(adding ? `Saved "${product.productName}" to your Wishlist ❤️` : "Removed from Wishlist");

    if (memberId) {
      const request = adding
        ? productService.likeProduct(product._id)
        : productService.unlikeProduct(product._id);
      request.catch((err) => {
        setItems(before);
        sweetErrorAlert(err?.response?.data?.message || "Could not update your wishlist. Please try again.");
      });
    }
    return adding;
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product._id)) toggleWishlist(product);
  };

  const removeFromWishlist = (productId: string) => {
    const product = items.find((p) => p._id === productId);
    if (product) toggleWishlist(product);
  };

  const clearWishlist = () => {
    const before = items;
    setItems([]);
    if (memberId) {
      Promise.all(before.map((p) => productService.unlikeProduct(p._id))).catch(() => {
        setItems(before);
        sweetErrorAlert("Could not clear your wishlist. Please try again.");
      });
    }
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
