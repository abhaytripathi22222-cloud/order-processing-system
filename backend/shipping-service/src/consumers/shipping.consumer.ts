import { getChannel } from "../config/rabbitmq";
import { ShippingService } from "../services/shipping.service";
import { ProcessedEventRepository } from "../repositories/processed-event.repository";

const shippingService = new ShippingService();
const processedRepository = new ProcessedEventRepository();

export async function startShippingConsumer() {
  const channel = getChannel();

  channel.consume("shipping.queue", async (msg: any) => {
    if (!msg) return;

    try {
      const payment = JSON.parse(msg.content.toString());

      // Correlation ID
      payment.correlationId =
        msg.properties.headers?.correlationId ||
        payment.correlationId;

      const eventId = payment.correlationId;

      // Idempotency Check
      const exists = await processedRepository.find(eventId);

      if (exists) {
        console.log(
          `[${eventId}] Duplicate payment.completed ignored`
        );

        channel.ack(msg);
        return;
      }

      console.log(
        `[${eventId}] Creating Shipment`
      );

      const shipment = await shippingService.ship(payment);

      channel.publish(
        "order-exchange",
        "shipment.created",
        Buffer.from(JSON.stringify(shipment)),
        {
          persistent: true,
          headers: {
            correlationId: eventId,
          },
        }
      );

      console.log(
        `[${eventId}] shipment.created published`
      );

      // Save processed event
      await processedRepository.create(
        eventId,
        "payment.completed"
      );

      console.log(
        `[${eventId}] Event marked as processed`
      );

      // ACK on success
      channel.ack(msg);

    } catch (error: any) {
      console.error(
        "Shipping Error:",
        error.message
      );

      // Let your retry/DLQ mechanism handle failures
      channel.nack(msg, false, false);
    }
  });

  console.log("Shipping Consumer Started");
}