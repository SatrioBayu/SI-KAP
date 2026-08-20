// frontend/src/api/spm.js
import api from "./axios";

export const getSpmList = () => api.get("/spm");

export const getSpmDetail = (id) => api.get(`/spm/${id}`);

export const getRiwayat = (id) => api.get(`/spm/${id}/riwayat`);

export const createSpmDraft = (formData) =>
  api.post("/spm", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateSpmDraft = (id, formData) =>
  api.patch(`/spm/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const ajukanSpm = (id) => api.post(`/spm/${id}/ajukan`);

export const validasiDokumen = (id, dokumenId, status) =>
  api.patch(`/spm/${id}/dokumen/${dokumenId}`, { status });

export const lanjutkanProses = (id) => api.post(`/spm/${id}/lanjutkan`);

export const tolakSpm = (id, catatan_alasan) =>
  api.post(`/spm/${id}/tolak`, { catatan_alasan });
