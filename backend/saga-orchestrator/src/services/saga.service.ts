import { getChannel } from "../config/rabbitmq";

export class SagaService {

  inventoryReserved(event: any) {
    console.log("================================");
    console.log(`[${event.correlationId}] ✅ Saga -> Inventory Reserved`);
    console.log(event.orderNumber);
    console.log("Waiting for Payment");
    console.log("================================");
  }

  paymentCompleted(event: any) {
    console.log("================================");
    console.log(`[${event.correlationId}] 💳 Saga -> Payment Completed`);
    console.log(event.orderNumber);
    console.log("Waiting for Shipment");
    console.log("================================");
  }

  paymentFailed(event: any) {
    console.log("================================");
    console.log(`[${event.correlationId}] ❌ Saga -> Payment Failed`);
    console.log(event.orderNumber);
    console.log("Publishing inventory.release");
    console.log("================================");

    getChannel().publish(
      "order-exchange",
      "inventory.release",
      Buffer.from(
        JSON.stringify({
          ...event,
          correlationId: event.correlationId,
        })
      ),
      {
        persistent: true,
        headers: {
          correlationId: event.correlationId,
        },
      }
    );

    console.log(
      `[${event.correlationId}] 📤 inventory.release published`
    );
  }

  shipmentCreated(event: any) {
    console.log("================================");
    console.log(`[${event.correlationId}] 🚚 Saga -> Shipment Created`);
    console.log(event.orderNumber);
    console.log("🎉 ORDER COMPLETED");
    console.log("================================");
  }
}