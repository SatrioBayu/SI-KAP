"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Dipa extends Model {
    static associate(models) {
      Dipa.belongsTo(models.User, {
        foreignKey: "dibuat_oleh",
        as: "approver",
      });
    }
  }
  Dipa.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      tahun: DataTypes.SMALLINT,
      tipe: DataTypes.ENUM("01", "05"),
      total_pagu: DataTypes.DECIMAL(18, 2),
      realisasi: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      dibuat_oleh: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Dipa",
      tableName: "dipa",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Dipa;
};
