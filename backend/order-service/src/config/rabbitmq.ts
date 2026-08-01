import amqp, { Channel, ChannelModel } from "amqplib";

let connection: ChannelModel;
let channel: Channel;

export async function connectRabbitMQ() {
  connection = await amqp.connect("amqp://localhost:5672");

  channel = await connection.createChannel();

  await channel.assertExchange("order-exchange", "topic", {
    durable: true,
  });
  await channel.assertQueue(
  "order.inventory.queue",
  {
    durable:true
  }
);


await channel.bindQueue(
  "order.inventory.queue",
  "order-exchange",
  "inventory.released"
);

  console.log("RabbitMQ Connected");
}

export function getChannel(): Channel {
  return channel;
}