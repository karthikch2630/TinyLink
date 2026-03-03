import express from 'express';
import cors from 'cors';
import { securityHeaders } from './middleware/securityHeaders.js';
import linksRouter from './routes/links.js';
import redirectRouter from './routes/redirect.js';
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(securityHeaders);

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CLIENT_URL
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '2kb' }));

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/links', linksRouter);
app.use('/r', redirectRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
