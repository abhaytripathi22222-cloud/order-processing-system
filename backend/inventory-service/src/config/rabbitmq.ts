import amqp from "amqplib";

let connection: any;
let channel: any;

export async function connectRabbitMQ() {
  connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672"
  );

  channel = await connection.createChannel();

  // Main Exchange
  await channel.assertExchange("order-exchange", "topic", {
    durable: true,
  });

  // Retry Exchange
  await channel.assertExchange("retry-exchange", "direct", {
    durable: true,
  });

  // Dead Letter Exchange
  await channel.assertExchange("dlx-exchange", "direct", {
    durable: true,
  });

  // DLQ
  await channel.assertQueue("inventory.dlq", {
    durable: true,
  });

  await channel.bindQueue(
    "inventory.dlq",
    "dlx-exchange",
    "inventory.failed"
  );

  // Retry Queue
  await channel.assertQueue("inventory.retry.queue", {
    durable: true,

    messageTtl: 5000,

    deadLetterExchange: "order-exchange",

    deadLetterRoutingKey: "order.created",
  });

  await channel.bindQueue(
    "inventory.retry.queue",
    "retry-exchange",
    "inventory.retry"
  );

// Main Queue
await channel.assertQueue("inventory.queue", {
  durable: true,
  deadLetterExchange: "dlx-exchange",
  deadLetterRoutingKey: "inventory.failed",
});


// Receive new orders
await channel.bindQueue(
  "inventory.queue",
  "order-exchange",
  "order.created"
);


// Receive compensation events
await channel.bindQueue(
  "inventory.queue",
  "order-exchange",
  "inventory.release"
);
  console.log("✅ Inventory RabbitMQ Connected");
}

export function getChannel() {
  return channel;
}