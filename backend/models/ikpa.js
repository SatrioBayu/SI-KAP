"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Ikpa extends Model {
    static associate(models) {
      Ikpa.belongsTo(models.User, {
        foreignKey: "dibuat_oleh",
        as: "approver",
      });
    }
  }
  Ikpa.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      tahun: DataTypes.SMALLINT,
      bulan: DataTypes.TINYINT,
      capaian_ikpa: DataTypes.DECIMAL(5, 2),
      dibuat_oleh: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Ikpa",
      tableName: "ikpa",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Ikpa;
};
