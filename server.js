// server.js
require("dotenv").config();

const express = require("express");            // FIX: import express
const app = require("./app");                  // Import the main app from app.js
const rateLimit = require("express-rate-limit");
const path = require("path");

// ---------- ENV ----------
const {
  NODE_ENV = "development",
  PORT = 5000,
  FRONTEND_URL = "https://eductportul.netlify.app",
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
  // In production (like your Netlify/Vercel frontend), redirect "/" to your frontend URL
  app.get("/", (req, res, next) => {
    if (req.path === "/" && !req.xhr) {
      return res.redirect(301, FRONTEND_URL);
    }
    next();
  });
} else {
  // In development, serve the static frontend from ../frontened
  const frontendPath = path.resolve(__dirname, "..", "frontened"); // FIX: correct folder name

  app.use(express.static(frontendPath));

  // Optional: explicit routes (nice URLs) for local dev
  app.get("/login", (req, res) =>
    res.sendFile(path.join(frontendPath, "login.html"))
  );
  app.get("/profile", (req, res) =>
    res.sendFile(path.join(frontendPath, "profile.html"))
  );
  app.get("/resources", (req, res) =>
    res.sendFile(path.join(frontendPath, "resources.html"))
  );
  app.get("/results", (req, res) =>
    res.sendFile(path.join(frontendPath, "results.html"))
  );
  app.get("/about", (req, res) =>
    res.sendFile(path.join(frontendPath, "about.html"))
  );
  app.get("/signup", (req, res) =>
    res.sendFile(path.join(frontendPath, "signup.html"))
  );

  // Fallback root route → index.html
  app.get("/", (req, res) =>
    res.sendFile(path.join(frontendPath, "index.html"))
  );
}

// ---------- Health Check ----------
app.get("/api", (req, res) => {
  res.json({ success: true, message: "EduPortal API is running" });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server Error" });
});

// ---------- Start Server ----------
const server = app.listen(PORT, "0.0.0.0", () => {
  const url = FRONTEND_URL.includes("localhost")
    ? `http://localhost:${PORT}`
    : FRONTEND_URL;

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
