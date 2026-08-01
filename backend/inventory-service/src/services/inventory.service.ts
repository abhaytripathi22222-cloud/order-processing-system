import { InventoryRepository } from "../repositories/inventory.repository";

export class InventoryService {
  private repository = new InventoryRepository();

  async reserve(order: any) {
    const stock = await this.repository.findBySku("LAPTOP");

    if (!stock) {
      throw new Error("Product not found");
    }

    const available = stock.quantity - stock.reserved;

    if (available < 1) {
      throw new Error("Out of stock");
    }

    await this.repository.reserveStock(stock.id, 1);

    await this.repository.createReservation({
      orderId: order.id,
      orderNumber: order.orderNumber,
      sku: "LAPTOP",
      quantity: 1,
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      sku: "LAPTOP",
      quantity: 1,
      status: "RESERVED",

      // ✅ Forward Correlation ID
      correlationId: order.correlationId,
    };
  }
}