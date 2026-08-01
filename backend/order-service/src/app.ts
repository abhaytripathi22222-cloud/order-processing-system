import express from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Order Service",
  });
});

app.use("/orders", orderRoutes);

// Error handler must be the last middleware
app.use(errorHandler);

export default app;