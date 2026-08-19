"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("spm", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      maker_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      tipe_dipa: {
        type: Sequelize.ENUM("01", "05"),
        allowNull: false,
      },
      jenis_spm: {
        type: Sequelize.ENUM(
          "UP",
          "GUP",
          "GUP Nihil",
          "GUP KKP",
          "PTUP KKP",
          "TUP",
          "PTUP",
          "Non Gaji Kontraktual",
          "Gaji Induk",
          "Gaji PPPK Induk",
          "Gaji Lainnya",
          "Kekurangan Gaji",
          "Susulan Gaji",
          "Gaji Terusan",
          "Gaji 13",
          "Gaji THR",
          "Non Gaji Pegawai",
        ),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "draft",
          "pengecekkan",
          "verifikasi",
          "disetujui",
          "ditolak",
        ),
        allowNull: false,
        defaultValue: "draft",
      },
      ditolak_oleh_role: {
        type: Sequelize.ENUM("checker", "approver"),
        allowNull: true,
      },
      catatan_penolakan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      decided_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("spm");
  },
};
