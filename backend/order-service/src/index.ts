import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startInventoryConsumer } from "./consumers/inventory.consumer";

const PORT = process.env.PORT || 3001;

async function bootstrap() {

  console.log("1. Starting RabbitMQ");

  await connectRabbitMQ();

  console.log("2. RabbitMQ Connected");

  await startInventoryConsumer();

  console.log("3. Consumer Started");

  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });

}

bootstrap().catch((err) => {
  console.error("Failed to start Order Service:", err);
});