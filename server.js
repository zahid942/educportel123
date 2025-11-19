// server.js
require("dotenv").config();
const app = require("./app"); // Import the main app from app.js
const rateLimit = require("express-rate-limit");
const path = require("path");

// ---------- ENV ----------
const {
  NODE_ENV = "development",
  PORT = 5000,
  FRONTEND_URL = "https://educportel.netlify.app",
} = process.env;

// ---------- Rate limit (Applied to results route) ----------
const limiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  message: { success: false, message: "Too many requests, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/results", limiter);

// ---------- Production Redirect and Static Serving ----------
if (NODE_ENV === "production") {
  app.get("/", (req, res, next) => {
    if (req.path === "/" && !req.xhr) {
      return res.redirect(301, FRONTEND_URL);
    }
    next();
  });
} else {
  const frontendPath = path.resolve(__dirname, "..", "frontend");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ---------- Health Check ----------
app.get("/api", (req, res) => {
  res.json({ success: true, message: "EduPortal API is running" });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server Error" });
});

// ---------- Start Server ----------
const server = app.listen(PORT, "0.0.0.0", () => {
  const url = FRONTEND_URL.includes("localhost") ? `http://localhost:${PORT}` : FRONTEND_URL;
  console.log(`Server running in ${NODE_ENV} mode`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Frontend: ${url}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});