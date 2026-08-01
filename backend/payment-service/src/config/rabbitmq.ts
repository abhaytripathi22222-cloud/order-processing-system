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

  await channel.assertQueue("payment.queue", {
    durable: true,
  });

  await channel.bindQueue(
    "payment.queue",
    "order-exchange",
    "inventory.reserved"
  );
channel.bindQueue(
  "payment.queue",
  "order-exchange",
  "inventory.reserved"
);
 connection.on("error", (err : any) => {
  console.error("RabbitMQ connection error:", err);
});

connection.on("close", () => {
  console.error("RabbitMQ connection closed");
});
  console.log("✅ Payment RabbitMQ Connected");
}

export function getChannel() {
  return channel;
}