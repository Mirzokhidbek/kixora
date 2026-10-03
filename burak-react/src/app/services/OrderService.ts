import axios from "axios";
import { serverApi } from "../../lib/config";
import type { CartItem } from "../../lib/types/cart";
import type { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../../lib/types/order";

class OrderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async createOrder(cartItems: CartItem[]): Promise<Order> {
    try {
      const orderItems: OrderItemInput[] = cartItems.map((item) => ({
        productId: item._id,
        itemQuantity: item.quantity,
        itemPrice: item.price,
      }));

      const url = `${this.path}/order/create`;
      const result = await axios.post(url, orderItems, {
        withCredentials: true,
      });

      return result.data;
    } catch (err) {
      console.log("Error, createOrder:", err);
      throw err;
    }
  }

  public async getMyOrders(inquiry: OrderInquiry): Promise<Order[]> {
    try {
      const url = `${this.path}/order/all?orderStatus=${inquiry.orderStatus}&page=${inquiry.page}&limit=${inquiry.limit}`;
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, getMyOrders:", err);
      throw err;
    }
  }

  public async updateOrder(input: OrderUpdateInput): Promise<Order> {
    try {
      const url = `${this.path}/order/update`;
      const result = await axios.post(url, input, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, updateOrder:", err);
      throw err;
    }
  }
}

export default OrderService;
