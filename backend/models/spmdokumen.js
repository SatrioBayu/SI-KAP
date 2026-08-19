"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SpmDokumen extends Model {
    static associate(models) {
      SpmDokumen.belongsTo(models.Spm, { foreignKey: "spm_id", as: "spm" });
    }
  }
  SpmDokumen.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      spm_id: DataTypes.UUID,
      nama_dokumen: DataTypes.STRING(150),
      file_path: DataTypes.STRING(255),
      status_checker: {
        type: DataTypes.ENUM("belum_dicek", "valid", "tidak_valid"),
        defaultValue: "belum_dicek",
      },
      dicek_checker_oleh: DataTypes.UUID,
      dicek_checker_at: DataTypes.DATE,
      status_approver: {
        type: DataTypes.ENUM("belum_dicek", "valid", "tidak_valid"),
        defaultValue: "belum_dicek",
      },
      dicek_approver_oleh: DataTypes.UUID,
      dicek_approver_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "SpmDokumen",
      tableName: "spm_dokumen",
      underscored: true,
      createdAt: "created_at",
      updatedAt: false,
    },
  );
  return SpmDokumen;
};
