"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Spm extends Model {
    static associate(models) {
      Spm.belongsTo(models.User, { foreignKey: "maker_id", as: "maker" });
      Spm.hasMany(models.SpmDokumen, { foreignKey: "spm_id", as: "dokumen" });
      Spm.hasMany(models.RiwayatStatus, {
        foreignKey: "spm_id",
        as: "riwayat",
      });
    }
  }
  Spm.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      maker_id: DataTypes.UUID,
      tipe_dipa: DataTypes.ENUM("01", "05"),
      jenis_spm: DataTypes.ENUM(
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
      status: {
        type: DataTypes.ENUM(
          "draft",
          "pengecekkan",
          "verifikasi",
          "disetujui",
          "ditolak",
        ),
        defaultValue: "draft",
      },
      ditolak_oleh_role: DataTypes.ENUM("checker", "approver"),
      catatan_penolakan: DataTypes.TEXT,
      submitted_at: DataTypes.DATE,
      verified_at: DataTypes.DATE,
      decided_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Spm",
      tableName: "spm",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Spm;
};
