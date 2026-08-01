import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class InventoryRepository {
  async findBySku(sku: string) {
    return prisma.inventory.findUnique({
      where: { sku },
    });
  }

  async reserveStock(id: number, qty: number) {
    return prisma.inventory.update({
      where: { id },
      data: {
        reserved: {
          increment: qty,
        },
      },
    });
  }

  async createReservation(data: {
    orderId: number;
    orderNumber: string;
    sku: string;
    quantity: number;
  }) {
    return prisma.reservation.create({
      data: {
        ...data,
        status: "RESERVED",
      },
    });
  }
}