import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiAlertCircle, FiFileText, FiPaperclip, FiTrash2 } from "react-icons/fi";
import { createSpmDraft, getSpmDetail, updateSpmDraft } from "../api/spm";
import { useAuth } from "../context/AuthContext";

const JENIS_SPM_OPTIONS = [
  "UP",
  "GUP",
  "GUP Nihil",
  "GUP KKP",
  "PTUP KKP",
  "TUP",
  "PTUP",
  "Non Gaji Kontraktual",
  "Gaji Induk",
  "Gaji PPPK Induk",
  "Gaji Lainnya",
  "Kekurangan Gaji",
  "Susulan Gaji",
  "Gaji Terusan",
  "Gaji 13",
  "Gaji THR",
  "Non Gaji Pegawai",
];

let rowIdCounter = 0;
function newRow() {
  rowIdCounter += 1;
  return { key: rowIdCounter, namaDokumen: "", file: null };
}

export default function SpmFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tipeDipa, setTipeDipa] = useState("01");
  const [jenisSpm, setJenisSpm] = useState(JENIS_SPM_OPTIONS[0]);
  const [existingDocs, setExistingDocs] = useState([]);
  const [dihapusIds, setDihapusIds] = useState([]);
  const [rows, setRows] = useState([newRow()]);

  const [loadingData, setLoadingData] = useState(isEdit);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    getSpmDetail(id)
      .then((res) => {
        const spm = res.data.data;

        if (spm.maker_id !== user.id) {
          setError("Anda tidak berhak mengubah SPM ini.");
          return;
        }
        if (!["draft", "ditolak"].includes(spm.status)) {
          setError("SPM hanya dapat diubah pada status draft atau ditolak.");
          return;
        }

        setTipeDipa(spm.tipe_dipa);
        setJenisSpm(spm.jenis_spm);
        setExistingDocs(spm.dokumen || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Gagal memuat data SPM");
      })
      .finally(() => setLoadingData(false));
  }, [id, isEdit, user.id]);

  const updateRow = (key, patch) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, newRow()]);

  const removeRow = (key) => setRows((prev) => prev.filter((r) => r.key !== key));

  const toggleHapusExisting = (dokId) => {
    setDihapusIds((prev) =>
      prev.includes(dokId) ? prev.filter((d) => d !== dokId) : [...prev, dokId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const dokumenTerisi = rows.filter((r) => r.namaDokumen.trim() || r.file);
    const belumLengkap = dokumenTerisi.some((r) => !r.namaDokumen.trim() || !r.file);
    if (belumLengkap) {
      setError("Setiap baris lampiran baru wajib memiliki nama dokumen dan file.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("tipe_dipa", tipeDipa);
      formData.append("jenis_spm", jenisSpm);
      dokumenTerisi.forEach((r) => {
        formData.append("nama_dokumen", r.namaDokumen.trim());
        formData.append("file", r.file);
      });

      if (isEdit) {
        dihapusIds.forEach((dokId) => formData.append("hapus_dokumen", dokId));
        await updateSpmDraft(id, formData);
        navigate(`/spm/${id}`, { replace: true });
      } else {
        const res = await createSpmDraft(formData);
        navigate(`/spm/${res.data.data.id}`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan SPM");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="spin-center">
        <span className="spinner" />
        Memuat data SPM...
      </div>
    );
  }

  return (
    <div className="card card-pad" style={{ maxWidth: 720 }}>
      {error && (
        <div className="alert alert-danger">
          <FiAlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="tipe_dipa">
              Tipe DIPA
            </label>
            <select
              id="tipe_dipa"
              className="select"
              value={tipeDipa}
              onChange={(e) => setTipeDipa(e.target.value)}
            >
              <option value="01">DIPA 01</option>
              <option value="05">DIPA 05</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="jenis_spm">
              Jenis SPM
            </label>
            <select
              id="jenis_spm"
              className="select"
              value={jenisSpm}
              onChange={(e) => setJenisSpm(e.target.value)}
            >
              {JENIS_SPM_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isEdit && existingDocs.length > 0 && (
          <div className="field-group">
            <label className="field-label">Dokumen yang sudah ada</label>
            <p className="field-hint" style={{ marginTop: -2, marginBottom: 12 }}>
              Centang tombol hapus untuk membuang lampiran dari SPM ini. Dokumen yang
              dipertahankan akan ditinjau ulang oleh Checker/Approver.
            </p>
            {existingDocs.map((dok) => {
              const ditandaiHapus = dihapusIds.includes(dok.id);
              return (
                <div
                  className="doc-row-item"
                  key={dok.id}
                  style={{ opacity: ditandaiHapus ? 0.5 : 1 }}
                >
                  <div className="doc-row-item-name">
                    <FiFileText size={15} color="var(--ink-faint)" />
                    <span style={{ textDecoration: ditandaiHapus ? "line-through" : "none" }}>
                      {dok.nama_dokumen}
                    </span>
                  </div>
                  <div className="doc-row-controls">
                    <a
                      className="doc-row-item-link"
                      href={dok.file_path}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lihat file
                    </a>
                    <button
                      type="button"
                      className={`btn btn-sm ${ditandaiHapus ? "btn-outline" : "btn-danger-outline"}`}
                      onClick={() => toggleHapusExisting(dok.id)}
                    >
                      {ditandaiHapus ? "Batal hapus" : "Hapus"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="field-group" style={{ marginTop: 6 }}>
          <label className="field-label">
            {isEdit ? "Tambah dokumen baru" : "Dokumen lampiran"}
          </label>
          <p className="field-hint" style={{ marginTop: -2, marginBottom: 12 }}>
            {isEdit
              ? "Opsional — tambahkan lampiran baru bila diperlukan."
              : "Opsional saat ini — dapat ditambahkan lampiran lain sebelum diajukan."}
          </p>

          {rows.map((row) => (
            <div className="doc-row" key={row.key}>
              <input
                type="text"
                className="input"
                placeholder="Nama dokumen, mis. Kuitansi"
                value={row.namaDokumen}
                onChange={(e) => updateRow(row.key, { namaDokumen: e.target.value })}
              />
              <input
                type="file"
                className="input"
                onChange={(e) => updateRow(row.key, { file: e.target.files?.[0] || null })}
              />
              <button
                type="button"
                className="doc-row-remove"
                onClick={() => removeRow(row.key)}
                disabled={rows.length === 1}
                title="Hapus baris"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}

          <button type="button" className="btn btn-outline btn-sm" onClick={addRow}>
            <FiPaperclip size={13} />
            Tambah lampiran
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan sebagai Draft"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(isEdit ? `/spm/${id}` : "/spm")}
            disabled={submitting}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
