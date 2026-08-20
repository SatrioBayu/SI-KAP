"use strict";
const { SpmDokumen } = require("../models");

class SpmDokumenRepository {
  async bulkCreate(daftarDokumen, options = {}) {
    return SpmDokumen.bulkCreate(daftarDokumen, options);
  }

  async findById(id) {
    return SpmDokumen.findByPk(id);
  }

  async findBySpmId(spmId) {
    return SpmDokumen.findAll({ where: { spm_id: spmId } });
  }

  async update(id, dataUpdate, options = {}) {
    return SpmDokumen.update(dataUpdate, { where: { id }, ...options });
  }

  async delete(id, options = {}) {
    return SpmDokumen.destroy({ where: { id }, ...options });
  }
}

module.exports = new SpmDokumenRepository();
