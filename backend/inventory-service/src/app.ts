import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "Inventory Service",
    status: "OK",
  });
});

export default app;