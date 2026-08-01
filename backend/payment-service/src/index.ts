import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startPaymentConsumer } from "./consumers/payment.consumer";

const PORT = process.env.PORT || 3003;

async function bootstrap() {
  await connectRabbitMQ();

  await startPaymentConsumer();

  app.listen(PORT, () => {
    console.log(`Payment Service running on ${PORT}`);
  });
}

bootstrap().catch(console.error);