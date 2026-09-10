import { serverApi } from "./config";

/**
 * Universal Image URL resolver for Kixora Frontend.
 * Ensures all local assets load via secure HTTPS relative URLs and uploaded assets
 * point to the configured backend API domain.
 */
export function getImageUrl(img?: string): string {
  if (!img || typeof img !== "string") return "";

  const trimmed = img.trim();
  if (!trimmed) return "";

  // Data URLs and Blob URLs
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // Normalize localhost backend URLs saved in legacy database entries
  let cleaned = trimmed
    .replace(/^https?:\/\/(localhost|127\.0\.0\.1):3001\/?/, "")
    .replace(/^\/+/, "");

  // Remove redundant "public/" prefix from backend upload paths
  if (cleaned.startsWith("public/")) {
    cleaned = cleaned.replace(/^public\//, "");
  }

  // 1. Static Frontend Assets (inside /public/img/... or /public/favicon...)
  if (cleaned.startsWith("img/") || cleaned.startsWith("favicon") || cleaned.startsWith("icons.svg")) {
    return `/${cleaned}`;
  }

  // 2. Full external URLs (e.g., Unsplash, Cloudinary, Firebase Storage)
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    // If frontend is loaded over HTTPS, upgrade insecure http CDN URLs to https if possible
    if (typeof window !== "undefined" && window.location.protocol === "https:" && cleaned.startsWith("http://") && !cleaned.includes("localhost")) {
      return cleaned.replace(/^http:\/\//, "https://");
    }
    return cleaned;
  }

  // 3. Backend Uploaded Assets (e.g. uploads/products/...)
  return `${serverApi}/${cleaned}`;
}

export default getImageUrl;
