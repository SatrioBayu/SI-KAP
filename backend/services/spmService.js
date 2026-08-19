"use strict";
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../models");
const spmRepository = require("../repositories/spmRepository");
const spmDokumenRepository = require("../repositories/spmDokumenRepository");
const riwayatStatusRepository = require("../repositories/riwayatStatusRepository");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

function buatError(pesan, statusCode) {
  const error = new Error(pesan);
  error.statusCode = statusCode;
  return error;
}

class SpmService {
  // Maker membuat SPM baru berstatus draft, dokumen lampiran diupload ke Cloudinary,
  // file_path di DB diisi URL Cloudinary (bukan path lokal)
  async createDraft(makerId, payload, files) {
    const { tipe_dipa, jenis_spm, nama_dokumen } = payload;

    if (!tipe_dipa || !jenis_spm) {
      throw buatError("Tipe DIPA dan Jenis SPM wajib diisi", 400);
    }

    const namaDokumenArray = Array.isArray(nama_dokumen)
      ? nama_dokumen
      : nama_dokumen
        ? [nama_dokumen]
        : [];

    if (files && files.length > 0 && namaDokumenArray.length !== files.length) {
      throw buatError(
        "Jumlah nama dokumen dan file yang diupload tidak sesuai",
        400,
      );
    }

    const transaction = await sequelize.transaction();
    try {
      const spmId = uuidv4();

      await spmRepository.create(
        {
          id: spmId,
          maker_id: makerId,
          tipe_dipa,
          jenis_spm,
          status: "draft",
        },
        { transaction },
      );

      if (files && files.length > 0) {
        const daftarDokumen = [];
        for (let i = 0; i < files.length; i++) {
          const hasilUpload = await uploadToCloudinary(files[i].buffer, {
            public_id: `${spmId}-${Date.now()}-${i}`,
          });

          daftarDokumen.push({
            id: uuidv4(),
            spm_id: spmId,
            nama_dokumen: namaDokumenArray[i],
            file_path: hasilUpload.secure_url,
          });
        }
        await spmDokumenRepository.bulkCreate(daftarDokumen, { transaction });
      }

      await transaction.commit();
      return spmRepository.findById(spmId);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // Maker mengajukan SPM (dari draft ATAU ditolak) ke Checker
  async ajukanPengecekan(spmId, userId) {
    const spm = await spmRepository.findById(spmId);
    if (!spm) {
      throw buatError("SPM tidak ditemukan", 404);
    }

    if (spm.maker_id !== userId) {
      throw buatError("Anda tidak berhak mengajukan SPM ini", 403);
    }

    if (!["draft", "ditolak"].includes(spm.status)) {
      throw buatError(
        "SPM hanya dapat diajukan dari status draft atau ditolak",
        400,
      );
    }

    const statusSebelum = spm.status;

    const transaction = await sequelize.transaction();
    try {
      await spmRepository.updateStatus(
        spmId,
        {
          status: "pengecekkan",
          submitted_at: new Date(),
        },
        { transaction },
      );

      await riwayatStatusRepository.create(
        {
          id: uuidv4(),
          spm_id: spmId,
          user_id: userId,
          status_dari: statusSebelum,
          status_ke: "pengecekkan",
          keterangan: "Diajukan oleh Maker ke Checker",
        },
        { transaction },
      );

      await transaction.commit();
      return spmRepository.findById(spmId);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // Checker atau Approver memvalidasi SATU dokumen lampiran (tombol V/X per dokumen)
  async validasiDokumen(spmId, dokumenId, user, statusValidasi) {
    if (!["valid", "tidak_valid"].includes(statusValidasi)) {
      throw buatError("Status validasi tidak valid", 400);
    }

    const spm = await spmRepository.findById(spmId);
    if (!spm) {
      throw buatError("SPM tidak ditemukan", 404);
    }

    const dokumen = await spmDokumenRepository.findById(dokumenId);
    if (!dokumen || dokumen.spm_id !== spmId) {
      throw buatError("Dokumen tidak ditemukan pada SPM ini", 404);
    }

    if (user.role === "checker") {
      if (spm.status !== "pengecekkan") {
        throw buatError("SPM tidak sedang dalam tahap pengecekan Checker", 400);
      }
      await spmDokumenRepository.update(dokumenId, {
        status_checker: statusValidasi,
        dicek_checker_oleh: user.id,
        dicek_checker_at: new Date(),
      });
    } else if (user.role === "approver") {
      if (spm.status !== "verifikasi") {
        throw buatError(
          "SPM tidak sedang dalam tahap verifikasi Approver",
          400,
        );
      }
      await spmDokumenRepository.update(dokumenId, {
        status_approver: statusValidasi,
        dicek_approver_oleh: user.id,
        dicek_approver_at: new Date(),
      });
    } else {
      throw buatError("Role Anda tidak berhak memvalidasi dokumen", 403);
    }

    return spmRepository.findById(spmId);
  }

  // Meneruskan SPM ke tahap berikutnya SETELAH semua dokumen bertanda valid.
  // Checker: pengecekkan -> verifikasi (diteruskan ke Approver)
  // Approver: verifikasi -> disetujui
  async lanjutkanProses(spmId, user) {
    const spm = await spmRepository.findById(spmId);
    if (!spm) {
      throw buatError("SPM tidak ditemukan", 404);
    }

    const transaction = await sequelize.transaction();
    try {
      if (user.role === "checker") {
        if (spm.status !== "pengecekkan") {
          throw buatError(
            "SPM tidak sedang dalam tahap pengecekan Checker",
            400,
          );
        }
        const adaBelumValid = spm.dokumen.some(
          (d) => d.status_checker !== "valid",
        );
        if (adaBelumValid) {
          throw buatError(
            "Semua dokumen harus berstatus valid sebelum diteruskan ke Approver",
            400,
          );
        }

        await spmRepository.updateStatus(
          spmId,
          {
            status: "verifikasi",
            verified_at: new Date(),
          },
          { transaction },
        );

        await riwayatStatusRepository.create(
          {
            id: uuidv4(),
            spm_id: spmId,
            user_id: user.id,
            status_dari: "pengecekkan",
            status_ke: "verifikasi",
            keterangan:
              "Seluruh dokumen dinyatakan valid oleh Checker, diteruskan ke Approver",
          },
          { transaction },
        );
      } else if (user.role === "approver") {
        if (spm.status !== "verifikasi") {
          throw buatError(
            "SPM tidak sedang dalam tahap verifikasi Approver",
            400,
          );
        }
        const adaBelumValid = spm.dokumen.some(
          (d) => d.status_approver !== "valid",
        );
        if (adaBelumValid) {
          throw buatError(
            "Semua dokumen harus berstatus valid sebelum SPM disetujui",
            400,
          );
        }

        await spmRepository.updateStatus(
          spmId,
          {
            status: "disetujui",
            decided_at: new Date(),
          },
          { transaction },
        );

        await riwayatStatusRepository.create(
          {
            id: uuidv4(),
            spm_id: spmId,
            user_id: user.id,
            status_dari: "verifikasi",
            status_ke: "disetujui",
            keterangan: "SPM disetujui oleh Approver",
          },
          { transaction },
        );
      } else {
        throw buatError(
          "Role Anda tidak berhak melanjutkan proses SPM ini",
          403,
        );
      }

      await transaction.commit();
      return spmRepository.findById(spmId);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // Checker atau Approver menolak SPM — catatan alasan WAJIB diisi
  async tolakSpm(spmId, user, catatanAlasan) {
    if (!catatanAlasan || !catatanAlasan.trim()) {
      throw buatError("Catatan alasan penolakan wajib diisi", 400);
    }

    const spm = await spmRepository.findById(spmId);
    if (!spm) {
      throw buatError("SPM tidak ditemukan", 404);
    }

    let bolehTolak = false;
    if (user.role === "checker") bolehTolak = spm.status === "pengecekkan";
    else if (user.role === "approver") bolehTolak = spm.status === "verifikasi";
    else throw buatError("Role Anda tidak berhak menolak SPM ini", 403);

    if (!bolehTolak) {
      throw buatError(
        "SPM tidak berada pada tahap yang dapat ditolak oleh role Anda",
        400,
      );
    }

    const statusSebelum = spm.status;

    const transaction = await sequelize.transaction();
    try {
      await spmRepository.updateStatus(
        spmId,
        {
          status: "ditolak",
          ditolak_oleh_role: user.role,
          catatan_penolakan: catatanAlasan,
        },
        { transaction },
      );

      await riwayatStatusRepository.create(
        {
          id: uuidv4(),
          spm_id: spmId,
          user_id: user.id,
          status_dari: statusSebelum,
          status_ke: "ditolak",
          keterangan: catatanAlasan,
        },
        { transaction },
      );

      await transaction.commit();
      return spmRepository.findById(spmId);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // Daftar SPM disesuaikan role yang login (role-aware querying)
  async getListForRole(user) {
    switch (user.role) {
      case "maker":
        return spmRepository.findAllByMaker(user.id);
      case "checker":
        return spmRepository.findAllByStatus("pengecekkan");
      case "approver":
        return spmRepository.findAllByStatus("verifikasi");
      case "kpa":
        throw buatError("Role KPA tidak memiliki akses ke menu SPM", 403);
      default:
        throw buatError("Role tidak dikenali", 403);
    }
  }

  async getDetail(spmId) {
    const spm = await spmRepository.findById(spmId);
    if (!spm) {
      throw buatError("SPM tidak ditemukan", 404);
    }
    return spm;
  }

  async getRiwayat(spmId) {
    const spm = await spmRepository.findById(spmId);
    if (!spm) {
      throw buatError("SPM tidak ditemukan", 404);
    }
    return riwayatStatusRepository.findBySpmId(spmId);
  }
}

module.exports = new SpmService();
