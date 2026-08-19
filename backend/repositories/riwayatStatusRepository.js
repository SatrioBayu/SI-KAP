"use strict";
const { RiwayatStatus } = require("../models");

class RiwayatStatusRepository {
  async create(data, options = {}) {
    return RiwayatStatus.create(data, options);
  }

  async findBySpmId(spmId) {
    return RiwayatStatus.findAll({
      where: { spm_id: spmId },
      order: [["created_at", "ASC"]],
    });
  }
}

module.exports = new RiwayatStatusRepository();
