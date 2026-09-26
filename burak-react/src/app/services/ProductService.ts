import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    try {
      let url = `${this.path}/product/all?order=${inquiry.order || "createdAt"}&page=${inquiry.page}&limit=${inquiry.limit}`;
      if (inquiry.productCollection) {
        url += `&productCollection=${inquiry.productCollection}`;
      }
      if (inquiry.search) {
        url += `&search=${inquiry.search}`;
      }

      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, getProducts:", err);
      throw err;
    }
  }

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
