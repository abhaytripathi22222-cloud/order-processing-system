import amqp from "amqplib";

let connection: any;
let channel: any;

export async function connectRabbitMQ() {
  const url =
    process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

  console.log("RabbitMQ URL:", url);

  connection = await amqp.connect(url);

  console.log("✅ Connected to RabbitMQ");

  channel = await connection.createChannel();

  await channel.assertExchange("order-exchange", "topic", {
    durable: true,
  });

await channel.assertQueue("notification.queue", {
  durable: true,
});

await channel.bindQueue(
  "notification.queue",
  "order-exchange",
  "shipment.created"
);

console.log("✅ Notification RabbitMQ Connected");
}

export function getChannel() {
  return channel;
}