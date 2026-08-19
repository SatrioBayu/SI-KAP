"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

// Helper bikin error dengan statusCode, biar controller tinggal baca err.statusCode
function buatError(pesan, statusCode) {
  const error = new Error(pesan);
  error.statusCode = statusCode;
  return error;
}

class AuthService {
  async login(username, password) {
    if (!username || !password) {
      throw buatError("Username dan password wajib diisi", 400);
    }

    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw buatError("Username atau password salah", 401);
    }

    const cocok = await bcrypt.compare(password, user.password_hash);
    if (!cocok) {
      throw buatError("Username atau password salah", 401);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    return {
      token,
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw buatError("User tidak ditemukan", 404);
    }

    return {
      id: user.id,
      nama: user.nama,
      username: user.username,
      role: user.role,
    };
  }
}

module.exports = new AuthService();
