import OrderService from "./Order.service";
import { AuthPayload } from "../libs/types/member";
import { Order } from "../libs/types/order";
import { env } from "../libs/config";
import { PaymentMethod, PaymentMode } from "../libs/enums/payment.enum";
import Errors, { HTTPCode, Message } from "../libs/Errors";

/**
 * Payment gateway boundary.
 * Today only a TEST provider (simulated, no real money) and MANUAL admin
 * confirmation exist. A real provider (Payme/Click) plugs in here: its webhook
 * verifies the provider signature and calls orderService.markPaid(..., "provider").
 */
class PaymentService {
  private readonly orderService = new OrderService();

  public getConfig() {
    const mode = env.paymentMode as PaymentMode;
    return {
      mode,
      methods: mode === PaymentMode.TEST ? [PaymentMethod.TEST, PaymentMethod.MANUAL] : [PaymentMethod.MANUAL],
      currency: "USD",
    };
  }

  /** Simulated provider: confirms the member's own unpaid order. Disabled outside test mode. */
  public async payWithTestProvider(member: AuthPayload, orderId: string): Promise<Order> {
    if (env.paymentMode !== PaymentMode.TEST) {
      throw new Errors(HTTPCode.FORBIDDEN, Message.TEST_PAYMENT_DISABLED);
    }
    return this.orderService.markPaid(orderId, PaymentMethod.TEST, "provider", member._id);
  }
}

export default PaymentService;
