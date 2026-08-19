"use strict";
const { Spm } = require("../models");

class SpmRepository {
  async create(data, options = {}) {
    return Spm.create(data, options);
  }

  async findById(id) {
    return Spm.findByPk(id, {
      include: [
        { association: "dokumen" },
        { association: "maker", attributes: ["id", "nama", "username"] },
      ],
    });
  }

  async findAllByMaker(makerId) {
    return Spm.findAll({
      where: { maker_id: makerId },
      order: [["created_at", "DESC"]],
    });
  }

  async findAllByStatus(status) {
    return Spm.findAll({
      where: { status },
      order: [["created_at", "DESC"]],
    });
  }

  async updateStatus(spmId, dataUpdate, options = {}) {
    return Spm.update(dataUpdate, { where: { id: spmId }, ...options });
  }
}

module.exports = new SpmRepository();
