import prisma from "../config/prisma";

export class OrderRepository {

    create(data: any) {
        return prisma.order.create({
            data
        });
    }

    findAll() {
        return prisma.order.findMany();
    }

    findById(id: number) {
        return prisma.order.findUnique({
            where: { id }
        });
    }

    update(id: number, status: string) {
        return prisma.order.update({
            where: { id },
            data: { status }
        });
    }
}