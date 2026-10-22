import axios from "axios";
import { serverApi } from "../../lib/config";
import type { Order } from "../../lib/types/order";

export type PaymentMethod = "TEST" | "MANUAL";

export interface PaymentConfig {
  mode: "test" | "manual";
  methods: PaymentMethod[];
  currency: string;
}

/** Payments are confirmed by the server only; the client never marks an order as paid */
class PaymentService {
  private readonly path = serverApi;

  public async getConfig(): Promise<PaymentConfig> {
    const result = await axios.get(`${this.path}/payment/config`, { withCredentials: true });
    return result.data;
  }

  /** Test mode only: simulated provider confirms the payment (no real money) */
  public async payWithTestProvider(orderId: string): Promise<Order> {
    const result = await axios.post(`${this.path}/payment/test/pay`, { orderId }, { withCredentials: true });
    return result.data;
  }
}

export default PaymentService;
