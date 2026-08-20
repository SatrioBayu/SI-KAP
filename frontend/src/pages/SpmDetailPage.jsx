import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiEdit3,
  FiExternalLink,
  FiFileText,
  FiSend,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import {
  ajukanSpm,
  getRiwayat,
  getSpmDetail,
  lanjutkanProses,
  tolakSpm,
  validasiDokumen,
} from "../api/spm";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { tipeDipaLabel } from "../utils/format";
import RiwayatTimeline from "../components/RiwayatTimeline";

function formatWaktu(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STAGE_ROLE = { pengecekkan: "checker", verifikasi: "approver" };
const STAGE_FIELD = { checker: "status_checker", approver: "status_approver" };

export default function SpmDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [spm, setSpm] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [busyDokumenId, setBusyDokumenId] = useState(null);
  const [showTolakModal, setShowTolakModal] = useState(false);
  const [catatanAlasan, setCatatanAlasan] = useState("");

  const load = useCallback(async () => {
    try {
      const [detailRes, riwayatRes] = await Promise.all([getSpmDetail(id), getRiwayat(id)]);
      setSpm(detailRes.data.data);
      setRiwayat(riwayatRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat detail SPM");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    Promise.all([getSpmDetail(id), getRiwayat(id)])
      .then(([detailRes, riwayatRes]) => {
        setSpm(detailRes.data.data);
        setRiwayat(riwayatRes.data.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Gagal memuat detail SPM");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="spin-center">
        <span className="spinner" />
        Memuat detail SPM...
      </div>
    );
  }

  if (error || !spm) {
    return (
      <div className="alert alert-danger">
        <FiAlertCircle size={16} />
        <span>{error || "SPM tidak ditemukan"}</span>
      </div>
    );
  }

  const isMakerOwner = user.role === "maker" && spm.maker_id === user.id;
  const canAjukan = isMakerOwner && ["draft", "ditolak"].includes(spm.status);

  const stageRole = STAGE_ROLE[spm.status]; // 'checker' | 'approver' | undefined
  const isReviewerActive = stageRole === user.role;
  const stageField = isReviewerActive ? STAGE_FIELD[stageRole] : null;
  const semuaValid = isReviewerActive
    ? (spm.dokumen || []).every((d) => d[stageField] === "valid")
    : false;

  const runAction = async (fn) => {
    setActionError("");
    setBusy(true);
    try {
      await fn();
      await load();
    } catch (err) {
      setActionError(err.response?.data?.message || "Aksi gagal diproses");
    } finally {
      setBusy(false);
    }
  };

  const handleAjukan = () => runAction(() => ajukanSpm(spm.id));

  const handleLanjutkan = () => runAction(() => lanjutkanProses(spm.id));

  const handleValidasiDokumen = async (dokumenId, statusValidasi) => {
    setActionError("");
    setBusyDokumenId(dokumenId);
    try {
      await validasiDokumen(spm.id, dokumenId, statusValidasi);
      await load();
    } catch (err) {
      setActionError(err.response?.data?.message || "Gagal memperbarui status dokumen");
    } finally {
      setBusyDokumenId(null);
    }
  };

  const handleTolak = async () => {
    if (!catatanAlasan.trim()) return;
    setActionError("");
    setBusy(true);
    try {
      await tolakSpm(spm.id, catatanAlasan.trim());
      setShowTolakModal(false);
      setCatatanAlasan("");
      await load();
    } catch (err) {
      setActionError(err.response?.data?.message || "Gagal menolak SPM");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        style={{ marginBottom: 18 }}
        onClick={() => navigate("/spm")}
      >
        &larr; Kembali ke daftar
      </button>

      <div className="card card-pad">
        <div className="detail-header">
          <div>
            <p className="detail-id mono">Berkas #{spm.id}</p>
            <h2 style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {spm.jenis_spm}
              <StatusBadge status={spm.status} stamp />
            </h2>
          </div>

          <div className="detail-actions">
            {canAjukan && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate(`/spm/${spm.id}/edit`)}
                disabled={busy}
              >
                <FiEdit3 size={14} />
                Ubah SPM
              </button>
            )}
            {canAjukan && (
              <button type="button" className="btn btn-primary" onClick={handleAjukan} disabled={busy}>
                <FiSend size={14} />
                Ajukan ke Checker
              </button>
            )}
            {isReviewerActive && (
              <>
                <button
                  type="button"
                  className="btn btn-danger-outline"
                  onClick={() => setShowTolakModal(true)}
                  disabled={busy}
                >
                  <FiXCircle size={14} />
                  Tolak
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleLanjutkan}
                  disabled={busy || !semuaValid}
                  title={!semuaValid ? "Semua dokumen harus bertanda valid terlebih dahulu" : ""}
                >
                  <FiArrowRight size={14} />
                  {stageRole === "checker" ? "Teruskan ke Approver" : "Setujui SPM"}
                </button>
              </>
            )}
          </div>
        </div>

        {actionError && (
          <div className="alert alert-danger">
            <FiAlertCircle size={16} />
            <span>{actionError}</span>
          </div>
        )}

        {spm.status === "ditolak" && (
          <div className="rejection-box">
            <h4>
              Ditolak oleh {spm.ditolak_oleh_role === "checker" ? "Checker" : "Approver"}
            </h4>
            <p>{spm.catatan_penolakan}</p>
          </div>
        )}

        <div className="meta-grid">
          <div>
            <div className="meta-item-label">Tipe DIPA</div>
            <div className="meta-item-value">{tipeDipaLabel(spm.tipe_dipa)}</div>
          </div>
          <div>
            <div className="meta-item-label">Diajukan oleh</div>
            <div className="meta-item-value">{spm.maker?.nama || "-"}</div>
          </div>
          <div>
            <div className="meta-item-label">Dibuat</div>
            <div className="meta-item-value">{formatWaktu(spm.created_at)}</div>
          </div>
          <div>
            <div className="meta-item-label">Diajukan ke Checker</div>
            <div className="meta-item-value">{formatWaktu(spm.submitted_at)}</div>
          </div>
          <div>
            <div className="meta-item-label">Diverifikasi</div>
            <div className="meta-item-value">{formatWaktu(spm.verified_at)}</div>
          </div>
          <div>
            <div className="meta-item-label">Diputuskan</div>
            <div className="meta-item-value">{formatWaktu(spm.decided_at)}</div>
          </div>
        </div>

        <h3 className="section-title">
          <FiFileText size={15} />
          Dokumen lampiran ({spm.dokumen?.length || 0})
        </h3>

        {!spm.dokumen || spm.dokumen.length === 0 ? (
          <p style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>Belum ada dokumen dilampirkan.</p>
        ) : (
          spm.dokumen.map((dok) => {
            const currentStatus = isReviewerActive ? dok[stageField] : null;
            return (
              <div className="doc-row-item" key={dok.id}>
                <div className="doc-row-item-name">
                  <FiFileText size={15} color="var(--ink-faint)" />
                  {dok.nama_dokumen}
                </div>

                <div className="doc-row-controls">
                  <a
                    className="doc-row-item-link"
                    href={dok.file_path}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat file <FiExternalLink size={12} />
                  </a>

                  {isReviewerActive ? (
                    <>
                      <button
                        type="button"
                        className={`doc-icon-btn valid-btn${currentStatus === "valid" ? " active-valid" : ""}`}
                        onClick={() => handleValidasiDokumen(dok.id, "valid")}
                        disabled={busyDokumenId === dok.id}
                        title="Tandai valid"
                      >
                        <FiCheck size={15} />
                      </button>
                      <button
                        type="button"
                        className={`doc-icon-btn invalid-btn${currentStatus === "tidak_valid" ? " active-invalid" : ""}`}
                        onClick={() => handleValidasiDokumen(dok.id, "tidak_valid")}
                        disabled={busyDokumenId === dok.id}
                        title="Tandai tidak valid"
                      >
                        <FiX size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className={`doc-pill ${dok.status_checker}`}>
                        Checker: {dok.status_checker.replace("_", " ")}
                      </span>
                      <span className={`doc-pill ${dok.status_approver}`}>
                        Approver: {dok.status_approver.replace("_", " ")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}

        <h3 className="section-title">
          <FiClock size={15} />
          Riwayat status
        </h3>
        <RiwayatTimeline riwayat={riwayat} />
      </div>

      {showTolakModal && (
        <div className="modal-backdrop" onClick={() => !busy && setShowTolakModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Tolak SPM ini?</h3>
            <p className="modal-sub">
              Catatan alasan wajib diisi agar Maker mengetahui perbaikan yang diperlukan.
            </p>
            <div className="field-group" style={{ marginBottom: 0 }}>
              <label className="field-label" htmlFor="catatan_alasan">
                Catatan alasan
              </label>
              <textarea
                id="catatan_alasan"
                className="input"
                rows={4}
                value={catatanAlasan}
                onChange={(e) => setCatatanAlasan(e.target.value)}
                placeholder="Jelaskan alasan penolakan..."
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowTolakModal(false)}
                disabled={busy}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger-outline"
                onClick={handleTolak}
                disabled={busy || !catatanAlasan.trim()}
              >
                Tolak SPM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
