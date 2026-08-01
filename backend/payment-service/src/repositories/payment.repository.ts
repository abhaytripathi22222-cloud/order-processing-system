import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PaymentRepository {
  async createPayment(data: any) {
    return prisma.payment.create({
      data,
    });
  }
}