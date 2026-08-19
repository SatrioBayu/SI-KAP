"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ikpa", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      tahun: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      bulan: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      capaian_ikpa: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
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

    await queryInterface.addConstraint("ikpa", {
      fields: ["tahun", "bulan"],
      type: "unique",
      name: "unique_tahun_bulan_ikpa",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("ikpa");
  },
};
