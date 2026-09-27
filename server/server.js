require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ message: "API is running" })
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ 
    message: "Something went wrong on the server." 
  });
});

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Local development only
    if (process.env.NODE_ENV !== "production") {
      const port = process.env.PORT || 5000;

      app.listen(port, () => {
        console.log(`API running at http://localhost:${port}`);
      });
    }
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

module.exports = app;