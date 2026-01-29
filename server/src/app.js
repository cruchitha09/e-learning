import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as apiRouter } from "./routes/index.js";

// Load environment variables (optional for your interview demo)
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
  // Allow requests from any origin during development
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
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

