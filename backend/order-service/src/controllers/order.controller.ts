import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { OrderService } from "../services/order.service";

export class OrderController {
  service = new OrderService();

  create = async (req: Request, res: Response) => {
    try {
      const order = await this.service.create(req.body);
      res.status(201).json(order);
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(409).json({
          success: false,
          message: "Order number already exists",
        });
      }

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    const orders = await this.service.getAll();
    res.json(orders);
  };

  getById = async (req: Request, res: Response) => {
    const order = await this.service.getById(Number(req.params.id));
    res.json(order);
  };
}