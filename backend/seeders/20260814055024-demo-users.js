// seeders/xxxx-demo-users.js
"use strict";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface) => {
    const passwordHash = await bcrypt.hash("pttunmks123", 10); // ganti sebelum production

    await queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        nama: "Maker SI-KAP",
        username: "maker",
        password_hash: passwordHash,
        role: "maker",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        nama: "Checker SI-KAP",
        username: "checker",
        password_hash: passwordHash,
        role: "checker",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        nama: "Approver SI-KAP",
        username: "approver",
        password_hash: passwordHash,
        role: "approver",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        nama: "KPA SI-KAP",
        username: "kpa",
        password_hash: passwordHash,
        role: "kpa",
        created_at: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
