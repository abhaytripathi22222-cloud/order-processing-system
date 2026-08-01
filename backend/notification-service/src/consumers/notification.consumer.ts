import { getChannel } from "../config/rabbitmq";
import { NotificationService } from "../services/notification.service";
import { ProcessedEventRepository } from "../repositories/processed-event.repository";

const notificationService = new NotificationService();
const processedRepository = new ProcessedEventRepository();


export async function startNotificationConsumer() {

  const channel = getChannel();


  channel.consume(
    "notification.queue",
    async (msg: any) => {

      if (!msg) return;


      try {

        const shipment = JSON.parse(
          msg.content.toString()
        );


        const correlationId =
          msg.properties.headers?.correlationId ||
          shipment.correlationId;


        console.log(
          `[${correlationId}] Shipment Event Received`
        );


        // ==========================
        // Idempotency Check
        // ==========================

        const processed =
          await processedRepository.find(
            correlationId
          );


        if (processed) {

          console.log(
            `[${correlationId}] Duplicate Event Ignored`
          );

          channel.ack(msg);
          return;

        }



        // ==========================
        // Send Notification
        // ==========================

        await notificationService.send(
          shipment
        );


        // ==========================
        // Save Processed Event
        // ==========================

        await processedRepository.create(
          correlationId,
          "shipment.created"
        );


        console.log(
          `[${correlationId}] Notification Event Processed`
        );


        // Success
        channel.ack(msg);


      } catch(error:any){


        console.error(
          "❌ Notification Error:",
          error.message
        );


        // Failure -> DLQ
        channel.nack(
          msg,
          false,
          false
        );

      }

    }
  );


  console.log(
    "Notification Consumer Started"
  );

}