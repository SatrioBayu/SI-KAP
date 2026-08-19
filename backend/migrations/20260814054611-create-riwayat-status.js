"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("riwayat_status", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      spm_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "spm", key: "id" },
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      status_dari: {
        type: Sequelize.ENUM(
          "draft",
          "pengecekkan",
          "verifikasi",
          "disetujui",
          "ditolak",
        ),
        allowNull: false,
      },
      status_ke: {
        type: Sequelize.ENUM(
          "draft",
          "pengecekkan",
          "verifikasi",
          "disetujui",
          "ditolak",
        ),
        allowNull: false,
      },
      keterangan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("riwayat_status");
  },
};
