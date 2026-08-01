import { getChannel } from "../config/rabbitmq";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function startInventoryConsumer() {
  const channel = getChannel();

  await channel.consume("order.inventory.queue", async (msg: any) => {
    if (!msg) return;

    try {
      console.log("================================");
      console.log("Message received");

      const routingKey = msg.fields.routingKey;
      const event = JSON.parse(msg.content.toString());

      console.log("Routing Key:", routingKey);
      console.log("Event:", event);

      // Process only inventory.released events
      if (routingKey !== "inventory.released") {
        console.log("Ignoring:", routingKey);
        channel.ack(msg);
        return;
      }

      console.log("Inventory Released Event");

      const updatedOrder = await prisma.order.update({
        where: {
          orderNumber: event.orderNumber,
        },
        data: {
          status: "CANCELLED",
        },
      });

      console.log("Order Cancelled");
      console.log(updatedOrder);

      channel.publish(
        "order-exchange",
        "order.cancelled",
        Buffer.from(JSON.stringify(event)),
        {
          persistent: true,
        }
      );

      console.log("order.cancelled published");
      console.log("================================");

      // Success
      channel.ack(msg);

    } catch (err: any) {
      console.error("================================");
      console.error("Consumer Error");
      console.error("Message:", err.message);
      console.error("Code:", err.code);
      console.error("Meta:", err.meta);
      console.error(err);
      console.error("================================");

      // Failure
      channel.nack(msg, false, false);
    }
  });

  console.log("Inventory Release Consumer Started");
}