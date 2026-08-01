import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
  private repository = new NotificationRepository();

 async send(shipment:any){

 console.log(
   `[${shipment.correlationId}] EMAIL SENT`
 );

 return this.repository.create({
    orderNumber: shipment.orderNumber,
    type:"EMAIL",
    recipient:"customer@example.com",
    status:"SENT"
 });

}
}