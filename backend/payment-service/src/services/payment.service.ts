import { getChannel } from "../config/rabbitmq";

export class PaymentService {
  async process(order: any) {
    console.log("================================");
    console.log(`[${order.correlationId}] Processing Payment`);
    console.log(order.orderNumber);
    console.log("================================");

    // Change this value to test success/failure
    const paymentSuccess = false;

    if (!paymentSuccess) {
      console.log("Payment Failed");

      const paymentEvent = {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        sku: order.sku,
        quantity: order.quantity,
        status: "PAYMENT_FAILED",
        correlationId: order.correlationId,
      };

      getChannel().publish(
        "order-exchange",
        "payment.failed",
        Buffer.from(JSON.stringify(paymentEvent)),
        {
          persistent: true,
          headers: {
            correlationId: order.correlationId,
          },
        }
      );

      console.log(
        `[${order.correlationId}] payment.failed published`
      );

      return;
    }

    console.log("Payment Successful");

    const paymentEvent = {
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      sku: order.sku,
      quantity: order.quantity,
      status: "PAYMENT_COMPLETED",
      correlationId: order.correlationId,
    };

    getChannel().publish(
      "order-exchange",
      "payment.completed",
      Buffer.from(JSON.stringify(paymentEvent)),
      {
        persistent: true,
        headers: {
          correlationId: order.correlationId,
        },
      }
    );

    console.log(
      `[${order.correlationId}] payment.completed published`
    );
  }
}