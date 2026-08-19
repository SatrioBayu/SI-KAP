"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dipa", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      tahun: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      tipe: {
        type: Sequelize.ENUM("01", "05"),
        allowNull: false,
      },
      total_pagu: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      realisasi: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      dibuat_oleh: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
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

    await queryInterface.addConstraint("dipa", {
      fields: ["tahun", "tipe"],
      type: "unique",
      name: "unique_tahun_tipe_dipa",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("dipa");
  },
};
