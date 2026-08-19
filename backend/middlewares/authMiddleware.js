"use strict";
const jwt = require("jsonwebtoken");

// Memverifikasi JWT dari header Authorization: Bearer <token>
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, role }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token tidak valid atau kadaluarsa" });
  }
};
