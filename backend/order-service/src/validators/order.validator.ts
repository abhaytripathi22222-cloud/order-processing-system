import { z } from "zod";

export const createOrderSchema = z.object({
  orderNumber: z.string().min(3),
  customerId: z.string().min(3),
});