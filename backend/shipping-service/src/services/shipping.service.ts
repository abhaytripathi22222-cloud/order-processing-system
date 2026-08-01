import { ShippingRepository } from "../repositories/shipping.repository";

export class ShippingService {
  private repository = new ShippingRepository();

  async ship(payment: any) {
    console.log(
      `[${payment.correlationId}] Shipping`
    );

    const shipment = await this.repository.createShipment({
      orderId: payment.orderId,
      orderNumber: payment.orderNumber,
      trackingNumber: "TRK-" + Date.now(),
      carrier: "BlueDart",
      status: "CREATED",
    });

    return {
      ...shipment,
      correlationId: payment.correlationId,
    };
  }
}