'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiwayatStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RiwayatStatus.init({
    spm_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    status_dari: DataTypes.STRING,
    status_ke: DataTypes.STRING,
    keterangan: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'RiwayatStatus',
    underscored: true,
  });
  return RiwayatStatus;
};