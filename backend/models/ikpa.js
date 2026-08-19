"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RiwayatStatus extends Model {
    static associate(models) {
      RiwayatStatus.belongsTo(models.Spm, { foreignKey: "spm_id", as: "spm" });
      RiwayatStatus.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  RiwayatStatus.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      spm_id: DataTypes.UUID,
      user_id: DataTypes.UUID,
      status_dari: DataTypes.ENUM(
        "draft",
        "pengecekkan",
        "verifikasi",
        "disetujui",
        "ditolak",
      ),
      status_ke: DataTypes.ENUM(
        "draft",
        "pengecekkan",
        "verifikasi",
        "disetujui",
        "ditolak",
      ),
      keterangan: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "RiwayatStatus",
      tableName: "riwayat_status",
      underscored: true,
      createdAt: "created_at",
      updatedAt: false,
    },
  );
  return RiwayatStatus;
};
