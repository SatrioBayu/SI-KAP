"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Spm, { foreignKey: "maker_id", as: "daftarSpm" });
      User.hasMany(models.Dipa, {
        foreignKey: "dibuat_oleh",
        as: "daftarDipa",
      });
      User.hasMany(models.Ikpa, {
        foreignKey: "dibuat_oleh",
        as: "daftarIkpa",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      nama: DataTypes.STRING(150),
      username: {
        type: DataTypes.STRING(50),
        unique: true,
      },
      password_hash: DataTypes.STRING(255),
      role: DataTypes.ENUM("maker", "checker", "approver", "kpa"),
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      createdAt: "created_at",
      updatedAt: false,
    },
  );
  return User;
};
