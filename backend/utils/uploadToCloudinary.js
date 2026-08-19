"use strict";
const streamifier = require("streamifier");
const cloudinary = require("./cloudinary");

// Upload buffer (dari multer memoryStorage) langsung ke Cloudinary tanpa nyimpen ke disk server
function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // 'raw' karena file lampiran berupa PDF, bukan gambar
        folder: "sikap/spm-dokumen",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = uploadBufferToCloudinary;
