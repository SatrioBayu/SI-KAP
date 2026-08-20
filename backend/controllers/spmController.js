// "use strict";
// const spmService = require("../services/spmService");

// // POST /api/spm  (multipart/form-data)
// exports.createDraft = async (req, res) => {
//   try {
//     const spm = await spmService.createDraft(req.user.id, req.body, req.files);
//     return res
//       .status(201)
//       .json({ message: "SPM berhasil disimpan sebagai draft", data: spm });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // PUT /api/spm/:id   body: { tipe_dipa?, jenis_spm? }
// exports.updateDraft = async (req, res) => {
//   try {
//     const spm = await spmService.updateDraft(
//       req.params.id,
//       req.user.id,
//       req.body,
//     );
//     return res.json({ message: "SPM berhasil diperbarui", data: spm });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // POST /api/spm/:id/dokumen  (multipart/form-data)
// exports.tambahDokumen = async (req, res) => {
//   try {
//     const spm = await spmService.tambahDokumen(
//       req.params.id,
//       req.user.id,
//       req.body,
//       req.files,
//     );
//     return res
//       .status(201)
//       .json({ message: "Dokumen berhasil ditambahkan", data: spm });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // DELETE /api/spm/:id/dokumen/:dokumenId
// exports.hapusDokumen = async (req, res) => {
//   try {
//     const spm = await spmService.hapusDokumen(
//       req.params.id,
//       req.user.id,
//       req.params.dokumenId,
//     );
//     return res.json({ message: "Dokumen berhasil dihapus", data: spm });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // POST /api/spm/:id/ajukan
// exports.ajukanPengecekan = async (req, res) => {
//   try {
//     const spm = await spmService.ajukanPengecekan(req.params.id, req.user.id);
//     return res.json({ message: "SPM berhasil diajukan ke Checker", data: spm });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // PATCH /api/spm/:id/dokumen/:dokumenId   body: { status: 'valid' | 'tidak_valid' }
// exports.validasiDokumen = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const spm = await spmService.validasiDokumen(
//       req.params.id,
//       req.params.dokumenId,
//       req.user,
//       status,
//     );
//     return res.json({
//       message: "Status dokumen berhasil diperbarui",
//       data: spm,
//     });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // POST /api/spm/:id/lanjutkan
// exports.lanjutkanProses = async (req, res) => {
//   try {
//     const spm = await spmService.lanjutkanProses(req.params.id, req.user);
//     return res.json({
//       message: "SPM berhasil diteruskan ke tahap berikutnya",
//       data: spm,
//     });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // POST /api/spm/:id/tolak   body: { catatan_alasan }
// exports.tolak = async (req, res) => {
//   try {
//     const { catatan_alasan } = req.body;
//     const spm = await spmService.tolakSpm(
//       req.params.id,
//       req.user,
//       catatan_alasan,
//     );
//     return res.json({ message: "SPM berhasil ditolak", data: spm });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // GET /api/spm
// exports.getList = async (req, res) => {
//   try {
//     const daftar = await spmService.getListForRole(req.user);
//     return res.json({ data: daftar });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // GET /api/spm/:id
// exports.getDetail = async (req, res) => {
//   try {
//     const spm = await spmService.getDetail(req.params.id);
//     return res.json({ data: spm });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

// // GET /api/spm/:id/riwayat
// exports.getRiwayat = async (req, res) => {
//   try {
//     const riwayat = await spmService.getRiwayat(req.params.id);
//     return res.json({ data: riwayat });
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Terjadi kesalahan pada server" });
//   }
// };

"use strict";
const spmService = require("../services/spmService");

// POST /api/spm  (multipart/form-data)
exports.createDraft = async (req, res) => {
  try {
    const spm = await spmService.createDraft(req.user.id, req.body, req.files);
    return res
      .status(201)
      .json({ message: "SPM berhasil disimpan sebagai draft", data: spm });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Terjadi kesalahan pada server" });
  }
};

// PATCH /api/spm/:id  (multipart/form-data) — Maker mengedit SPM saat draft/ditolak
exports.updateDraft = async (req, res) => {
  try {
    const spm = await spmService.updateDraft(
      req.params.id,
      req.user,
      req.body,
      req.files,
    );
    return res.json({ message: "SPM berhasil diperbarui", data: spm });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Terjadi kesalahan pada server" });
  }
};

// POST /api/spm/:id/ajukan
exports.ajukanPengecekan = async (req, res) => {
  try {
    const spm = await spmService.ajukanPengecekan(req.params.id, req.user.id);
    return res.json({ message: "SPM berhasil diajukan ke Checker", data: spm });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Terjadi kesalahan pada server" });
  }
};

// PATCH /api/spm/:id/dokumen/:dokumenId   body: { status: 'valid' | 'tidak_valid' }
exports.validasiDokumen = async (req, res) => {
  try {
    const { status } = req.body;
    const spm = await spmService.validasiDokumen(
      req.params.id,
      req.params.dokumenId,
      req.user,
      status,
    );
    return res.json({
      message: "Status dokumen berhasil diperbarui",
      data: spm,
    });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Terjadi kesalahan pada server" });
  }
};

// POST /api/spm/:id/lanjutkan
exports.lanjutkanProses = async (req, res) => {
  try {
    const spm = await spmService.lanjutkanProses(req.params.id, req.user);
    return res.json({
      message: "SPM berhasil diteruskan ke tahap berikutnya",
      data: spm,
    });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Terjadi kesalahan pada server" });
  }
};

// POST /api/spm/:id/tolak   body: { catatan_alasan }
exports.tolak = async (req, res) => {
  try {
    const { catatan_alasan } = req.body;
    const spm = await spmService.tolakSpm(
      req.params.id,
      req.user,
      catatan_alasan,
    );
    return res.json({ message: "SPM berhasil ditolak", data: spm });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Terjadi kesalahan pada server" });
  }
};

// GET /api/spm
exports.getList = async (req, res) => {
  try {
    const daftar = await spmService.getListForRole(req.user);
    return res.json({ data: daftar });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Terjadi kesalahan pada server" });
  }
};

// GET /api/spm/:id
exports.getDetail = async (req, res) => {
  try {
    const spm = await spmService.getDetail(req.params.id);
    return res.json({ data: spm });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Terjadi kesalahan pada server" });
  }
};

// GET /api/spm/:id/riwayat
exports.getRiwayat = async (req, res) => {
  try {
    const riwayat = await spmService.getRiwayat(req.params.id);
    return res.json({ data: riwayat });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Terjadi kesalahan pada server" });
  }
};
