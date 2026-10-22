import type { Product } from "./types/product";

/**
 * How many pairs can be bought for a size. Products with per-size stock count each
 * size separately; otherwise the product total applies to every size.
 */
export function availableFor(product: Pick<Product, "productLeftCount" | "productSizeStock">, size?: number): number {
  if (product.productSizeStock?.length) {
    return product.productSizeStock.find((s) => s.size === size)?.count ?? 0;
  }
  return Math.max(0, product.productLeftCount ?? 0);
}
