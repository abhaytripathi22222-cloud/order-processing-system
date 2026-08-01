import { getChannel } from "../config/rabbitmq";
import { SagaService } from "../services/saga.service";

const saga = new SagaService();

export async function startPaymentConsumer() {
  const channel = getChannel();

  channel.consume("saga.payment", async (msg: any) => {
    if (!msg) return;

    try {
      const routingKey = msg.fields.routingKey;
      const event = JSON.parse(msg.content.toString());

      if (routingKey === "payment.completed") {
        saga.paymentCompleted(event);
      }

      if (routingKey === "payment.failed") {
        saga.paymentFailed(event);
      }

      channel.nack(msg, false, false);
    } catch (err) {
      console.error(err);
      channel.nack(msg, false, false);
    }
  });

  console.log("Payment Consumer Started");
}