import amqp from "amqplib";

let connection: any;
let channel: any;

export async function connectRabbitMQ() {
  console.log("RabbitMQ URL:", process.env.RABBITMQ_URL);

  connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672"
  );

  channel = await connection.createChannel();

  await channel.assertExchange("order-exchange", "topic", {
    durable: true,
  });

  await channel.assertQueue("saga.inventory", {
    durable: true,
  });

  await channel.assertQueue("saga.payment", {
    durable: true,
  });

  await channel.assertQueue("saga.shipping", {
    durable: true,
  });

  await channel.bindQueue(
    "saga.inventory",
    "order-exchange",
    "inventory.reserved"
  );

  await channel.bindQueue(
    "saga.payment",
    "order-exchange",
    "payment.completed"
  );

  await channel.bindQueue(
    "saga.payment",
    "order-exchange",
    "payment.failed"
  );

  // await channel.bindQueue(
  //   "saga.shipping",
  //   "order-exchange",
  //   "shipment.created"
  // );
  

  console.log("✅ Saga RabbitMQ Connected");
}

export function getChannel() {
  return channel;
}