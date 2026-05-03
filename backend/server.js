// server.js – Express entry point
require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');
const { authenticate } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const presetRoutes = require('./routes/presets');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow localhost in dev + the deployed frontend URL set via FRONTEND_URL env var
const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (localhostRegex.test(origin)) return callback(null, true);
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Public routes – no token needed
app.use('/api/auth', authRoutes);

// Protected routes – JWT required for all preset operations
app.use('/api/presets', authenticate, presetRoutes);

// Simple health check so you can confirm the server is up
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Serve the frontend (index.html + css/js) from the project root
app.use(express.static(path.join(__dirname, '..')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Physics Sim API running at http://localhost:${PORT}`);
});
