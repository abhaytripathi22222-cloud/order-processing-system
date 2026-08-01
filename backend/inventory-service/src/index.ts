import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startInventoryConsumer } from "./consumers/Inventory.consumer";
import { startDLQConsumer } from "./consumers/dlq.consumer";

const PORT = process.env.PORT || 3002;

async function bootstrap() {
  await connectRabbitMQ();

  await startInventoryConsumer();
  await startDLQConsumer();

  app.listen(PORT, () => {
    console.log(`Inventory Service running on ${PORT}`);
  });
}

bootstrap().catch(console.error);