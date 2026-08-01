import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startNotificationConsumer } from "./consumers/notification.consumer";

const PORT = process.env.PORT || 3005;

async function bootstrap() {
  await connectRabbitMQ();

  await startNotificationConsumer();

  app.listen(PORT, () => {
    console.log(`Notification Service running on ${PORT}`);
  });
}

bootstrap().catch(console.error);