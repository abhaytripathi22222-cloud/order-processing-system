import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class NotificationRepository {
  create(data: any) {
    return prisma.notification.create({
      data,
    });
  }
}