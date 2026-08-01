import { getChannel } from "../config/rabbitmq";
import { PaymentService } from "../services/payment.service";

const paymentService = new PaymentService();

export async function startPaymentConsumer() {
  const channel = getChannel();

  channel.consume("payment.queue", async (msg: any) => {
    if (!msg) return;

    try {
     
      const reservation = JSON.parse(
  msg.content.toString()
);

      console.log("Processing Payment...");
      console.log(reservation);

      // PaymentService will publish payment.completed or payment.failed
      await paymentService.process(reservation);

      channel.nack(msg, false, false);
    } catch (error: any) {
      console.error("Payment Consumer Error:", error.message);

      channel.nack(msg, false, false);
    }
  });

  console.log("Payment Consumer Started");
}