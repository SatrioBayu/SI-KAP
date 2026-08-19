"use strict";
const multer = require("multer");

// memoryStorage: file cuma numpang di RAM (req.file.buffer), lalu diteruskan ke Cloudinary.
// Tidak pernah ditulis ke disk server.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("File lampiran harus berformat PDF"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // maks. 2 MB sesuai dokumen
});

module.exports = upload;
