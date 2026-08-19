"use strict";
const { User } = require("../models");

// Layer akses data — satu-satunya tempat yang boleh menyentuh model User langsung
class UserRepository {
  async findByUsername(username) {
    return User.findOne({ where: { username } });
  }

  async findById(id) {
    return User.findByPk(id);
  }
}

module.exports = new UserRepository();
