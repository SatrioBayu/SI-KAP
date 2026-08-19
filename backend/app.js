// backend/app.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const spmRoutes = require("./routes/spmRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SI-KAP API berjalan" });
});

app.use("/api/auth", authRoutes);
app.use("/api/spm", spmRoutes);

module.exports = app;
