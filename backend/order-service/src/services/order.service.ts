import { OrderRepository } from "../repositories/order.repository";
import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderStatus } from "../types/order-status";
import { getChannel } from "../config/rabbitmq";
import { v4 as uuid } from "uuid";

export class OrderService {
  private repository = new OrderRepository();

  async create(dto: CreateOrderDto) {

    const order = await this.repository.create({
      orderNumber: dto.orderNumber,
      customerId: dto.customerId,
      sku: dto.sku,
      quantity: dto.quantity,
      status: OrderStatus.NEW,
    });
    const correlationId = uuid();
    getChannel().publish(
      "order-exchange",
      "order.created",
      Buffer.from(
        JSON.stringify({
          ...order,
          correlationId,
        })
      ),
      {
        persistent: true,
        headers: {
          correlationId,
        },
      }
    );

    console.log(
      `[${correlationId}] 📤 order.created`
    );

    return order;
  }

  getAll() {
    return this.repository.findAll();
  }

  getById(id: number) {
    return this.repository.findById(id);
  }
}