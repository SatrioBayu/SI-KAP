"use strict";
const authService = require("../services/authService");

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hasil = await authService.login(username, password);
    return res.json(hasil);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Terjadi kesalahan pada server",
    });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return res.json({ user });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Terjadi kesalahan pada server",
    });
  }
};
