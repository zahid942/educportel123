// app.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const path = require('path');

const app = express();

// ---------- CORS (From server.js integration) ----------
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      "http://localhost:3000",
      "https://6915d5bfed8e0050561c47ef--edportel.netlify.app",
      "https://69181fe241d3be546a25156e--dynamic-narwhal-13fd9a.netlify.app",
      "https://69184cb2aad5aca296994e4c--spectacular-malabi-3aaba4.netlify.app",
      "https://edportul.netlify.app",
      "https://educportel.netlify.app",
    ];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked: Origin ${origin} not allowed`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ---------- Body Parsers ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---------- API Routes ----------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/results', require('./routes/results'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/pages', require('./routes/pages'));

// ---------- Sync DB and Start ----------
sequelize.sync({ alter: true }) // Auto-migrate tables
  .then(() => console.log('✅ Tables synced'))
  .catch((err) => console.error('❌ DB sync failed:', err));

module.exports = app;