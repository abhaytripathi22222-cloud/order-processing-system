import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startShippingConsumer } from "./consumers/shipping.consumer";

const PORT = process.env.PORT || 3004;

async function bootstrap() {
  await connectRabbitMQ();
  await startShippingConsumer();

  app.listen(PORT, () => {
    console.log(`🚀 Shipping Service running on ${PORT}`);
  });
}

bootstrap().catch(console.error);