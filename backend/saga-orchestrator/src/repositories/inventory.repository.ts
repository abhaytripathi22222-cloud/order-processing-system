import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ShippingRepository {
  createShipment(data: any) {
    return prisma.shipment.create({
      data,
    });
  }
}