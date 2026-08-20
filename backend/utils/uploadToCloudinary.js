"use strict";
const streamifier = require("streamifier");
const cloudinary = require("./cloudinary");

// Terima buffer file dari multer (memoryStorage) -> upload ke Cloudinary -> return hasil (termasuk secure_url)
function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // dokumen PDF, bukan gambar
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

// Ambil public_id dari secure_url Cloudinary, dipakai saat mau hapus file.
// Contoh url: https://res.cloudinary.com/xxx/raw/upload/v169.../sikap/spm-dokumen/nama.pdf
// -> public_id: sikap/spm-dokumen/nama
function extractPublicId(url) {
  try {
    const setelahUpload = url.split("/upload/")[1]; // v169.../sikap/spm-dokumen/nama.pdf
    const tanpaVersion = setelahUpload.replace(/^v\d+\//, ""); // sikap/spm-dokumen/nama.pdf
    const tanpaEkstensi = tanpaVersion.replace(/\.[^/.]+$/, ""); // sikap/spm-dokumen/nama
    return tanpaEkstensi;
  } catch (err) {
    return null;
  }
}

// Hapus file dari Cloudinary berdasarkan secure_url yang tersimpan di DB
async function deleteFromCloudinary(fileUrl) {
  const publicId = extractPublicId(fileUrl);
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
}

module.exports = { uploadToCloudinary, extractPublicId, deleteFromCloudinary };
