// ✅ Import core packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// ✅ Load environment variables
dotenv.config();

// ✅ Import PostgreSQL connection
const pool = require("./config/db");

// ✅ Create Express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Optional: Serve static frontend (if you deploy fullstack on one server)
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Import route files
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const profileRoutes = require("./routes/profile");
const resultsRoutes = require("./routes/results");
const resourcesRoutes = require("./routes/resources");
const pagesRoutes = require("./routes/pages");

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/pages", pagesRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ success: true, message: "EduPortal API is running 🚀" });
});

// ✅ Test PostgreSQL connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL successfully!");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
  }
})();

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));