import { getChannel } from "../config/rabbitmq";
import { SagaService } from "../services/saga.service";

const saga = new SagaService();

export async function startShippingConsumer() {
  const channel = getChannel();

  channel.consume("saga.shipping", async (msg: any) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());

      saga.shipmentCreated(event);

      channel.nack(msg, false, false);
    } catch (err) {
      console.error(err);
      channel.nack(msg, false, false);
    }
  });

  console.log("👂 Shipping Consumer Started");
}