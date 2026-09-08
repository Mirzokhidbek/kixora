/**
 * ============================================================================
 * OrderService.ts - Client API Service for Order Management
 * ============================================================================
 * Handles creating customer orders from active cart items, retrieving orders
 * by status (PAUSE, PROCESS, FINISH), and updating order workflow states.
 */

import axios from "axios";
import { serverApi } from "../../lib/config";
import type { CartItem } from "../../lib/types/cart";
import type { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../../lib/types/order";

class OrderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /**
   * Create a new order with multiple line items from customer shopping cart.
   * @param cartItems - Current items in user basket
   * @returns Newly created Order document
   */
  public async createOrder(cartItems: CartItem[]): Promise<Order> {
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
  }

  /**
   * Fetch authenticated user's orders filtered by status (PAUSE, PROCESS, FINISH).
   * @param inquiry - Query options including status, page, and limit
   * @returns List of Order documents populated with product details
   */
  public async getMyOrders(inquiry: OrderInquiry): Promise<Order[]> {
    const url = `${this.path}/order/all?orderStatus=${inquiry.orderStatus}&page=${inquiry.page}&limit=${inquiry.limit}`;
    const result = await axios.get(url, { withCredentials: true });
    return result.data;
  }

  /**
   * Transition order status (e.g., PAUSE -> PROCESS or PROCESS -> FINISH).
   * @param input - Contains orderId and target orderStatus
   * @returns Updated Order document
   */
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

