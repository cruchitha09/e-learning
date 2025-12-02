import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as apiRouter } from "./routes/index.js";

// Load environment variables (optional for your interview demo)
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.WEB_ORIGIN || "*" }));
app.use(express.json());

// Simple health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "e-learn-server", version: "0.1.0" });
});

// All API routes under /api
app.use("/api", apiRouter);

// Basic error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

