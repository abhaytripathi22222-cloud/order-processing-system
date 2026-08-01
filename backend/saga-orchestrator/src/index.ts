import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";

import { startInventoryConsumer } from "./consumers/inventory.consumer";
import { startPaymentConsumer } from "./consumers/payment.consumer";
import { startShippingConsumer } from "./consumers/shipping.consumer";

const PORT = Number(process.env.PORT) || 3006;

async function bootstrap() {
  await connectRabbitMQ();

  await startInventoryConsumer();
  await startPaymentConsumer();
  await startShippingConsumer();

  app.listen(PORT, () => {
    console.log(`Saga running on ${PORT}`);
  });
}

bootstrap().catch(console.error);