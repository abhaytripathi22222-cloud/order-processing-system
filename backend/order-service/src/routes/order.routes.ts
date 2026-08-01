import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { validate } from "../middleware/validate.middleware";
import { createOrderSchema } from "../validators/order.validator";

const router = Router();
const controller = new OrderController();

router.post(
  "/",
  validate(createOrderSchema),
  controller.create
);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

export default router;