import { getChannel } from "../config/rabbitmq";

export async function startDLQConsumer() {
  const channel = getChannel();

  channel.consume("inventory.dlq", (msg: any) => {
    if (!msg) return;

    console.log("================================");
    console.log("💀 DEAD LETTER MESSAGE");
    console.log(msg.content.toString());
    console.log("================================");

    channel.ack(msg);
  });

  console.log("👂 Inventory DLQ Consumer Started");
}