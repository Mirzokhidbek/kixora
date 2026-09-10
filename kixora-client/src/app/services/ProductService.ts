/**
 * ============================================================================
 * ProductService.ts - Client API Service for Menu & Product Operations
 * ============================================================================
 * Handles fetching product listings, filtering by category, search queries,
 * sorting, pagination, and fetching detailed product info by ID.
 */

import axios from "axios";
import { serverApi } from "../../lib/config";
import type { AISearchResponse, Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /**
   * AI Semantic Natural Language Search via Gemini AI
   * @param query - Free text user prompt in Uzbek, English, or Russian
   * @returns Intent extraction, recommendation and matched products
   */
  public async aiSearchProducts(query: string): Promise<AISearchResponse> {
    try {
      const url = `${this.path}/product/ai-search`;
      const result = await axios.post(
        url,
        { query },
        { withCredentials: true }
      );
      return result.data;
    } catch (err) {
      console.log("Error, aiSearchProducts:", err);
      throw err;
    }
  }

  /**
   * Fetch paginated list of dishes with optional search and category filters.
   * @param inquiry - Query options: page, limit, order, category, search
   * @returns List of matching Product objects
   */
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    try {
      let url = `${this.path}/product/all?order=${inquiry.order || "createdAt"}&page=${inquiry.page}&limit=${inquiry.limit}`;
      if (inquiry.productCollection) {
        url += `&productCollection=${inquiry.productCollection}`;
      }
      if (inquiry.search) {
        url += `&search=${encodeURIComponent(inquiry.search)}`;
      }
      if (inquiry.size) {
        url += `&size=${inquiry.size}`;
      }
      if (inquiry.color) {
        url += `&color=${encodeURIComponent(inquiry.color)}`;
      }

      const result = await axios.get(url, { withCredentials: true });
      if (Array.isArray(result.data)) {
        return result.data;
      }
      if (result.data && Array.isArray(result.data.data)) {
        return result.data.data;
      }
      return [];
    } catch (err) {
      console.log("Error, getProducts:", err);
      return [];
    }
  }

  /**
   * Fetch a single dish by MongoDB ObjectId and increments view counter.
   * @param productId - MongoDB ObjectId string
   * @returns Detailed Product object
   */
  public async getProduct(productId: string): Promise<Product> {
    try {
      const url = `${this.path}/product/${productId}`;
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, getProduct:", err);
      throw err;
    }
  }
}

export default ProductService;


