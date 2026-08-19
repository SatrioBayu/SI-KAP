"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("spm_dokumen", {
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
      nama_dokumen: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      file_path: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status_checker: {
        type: Sequelize.ENUM("belum_dicek", "valid", "tidak_valid"),
        allowNull: false,
        defaultValue: "belum_dicek",
      },
      dicek_checker_oleh: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
      dicek_checker_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status_approver: {
        type: Sequelize.ENUM("belum_dicek", "valid", "tidak_valid"),
        allowNull: false,
        defaultValue: "belum_dicek",
      },
      dicek_approver_oleh: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
      dicek_approver_at: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("spm_dokumen");
  },
};
