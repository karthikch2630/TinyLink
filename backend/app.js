// app.js
import express from "express";
import cors from "cors";
import { securityHeaders } from "./middleware/securityHeaders.js";
import linksRouter from "./routes/links.js";
import redirectRouter from "./routes/redirect.js";

const app = express();

// Security headers
app.use(securityHeaders);

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.CLIENT_URL,
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "2kb" }));

// Root route (professional touch)
app.get("/", (req, res) => {
  res.send("🚀 TinyLink API is running");
});

// Health check
app.get("/healthz", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/links", linksRouter);
app.use("/r", redirectRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

export default app;