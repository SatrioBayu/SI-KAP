"use strict";
const express = require("express");
const router = express.Router();
const spmController = require("../controllers/spmController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.use(authMiddleware); // semua route SPM wajib login

// Maker
router.post(
  "/",
  roleMiddleware("maker"),
  upload.array("file", 10),
  spmController.createDraft,
);
router.post(
  "/:id/ajukan",
  roleMiddleware("maker"),
  spmController.ajukanPengecekan,
);

// Checker & Approver — validasi per dokumen, lanjutkan proses, tolak
router.patch(
  "/:id/dokumen/:dokumenId",
  roleMiddleware("checker", "approver"),
  spmController.validasiDokumen,
);
router.post(
  "/:id/lanjutkan",
  roleMiddleware("checker", "approver"),
  spmController.lanjutkanProses,
);
router.post(
  "/:id/tolak",
  roleMiddleware("checker", "approver"),
  spmController.tolak,
);

// Semua role terautentikasi
router.get("/", spmController.getList);
router.get("/:id", spmController.getDetail);
router.get("/:id/riwayat", spmController.getRiwayat);

module.exports = router;
