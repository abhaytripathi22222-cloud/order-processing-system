import { getChannel } from "../config/rabbitmq";
import { SagaService } from "../services/saga.service";

const saga = new SagaService();

export async function startInventoryConsumer() {
  const channel = getChannel();

  channel.consume("saga.inventory", async (msg: any) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());

      saga.inventoryReserved(event);

      channel.nack(msg, false, false);
    } catch (err) {
      console.error(err);
      channel.nack(msg, false, false);
    }
  });

  console.log("👂 Inventory Consumer Started");
}