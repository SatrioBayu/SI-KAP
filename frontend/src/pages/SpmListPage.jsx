import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiFileText, FiPlus } from "react-icons/fi";
import { getSpmList } from "../api/spm";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { tipeDipaLabel } from "../utils/format";

function formatTanggal(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ROLE_CONTEXT = {
  maker: "Menampilkan seluruh SPM yang Anda ajukan.",
  checker: "Menampilkan SPM yang sedang menunggu pengecekan Anda.",
  approver: "Menampilkan SPM yang sedang menunggu verifikasi Anda.",
};

export default function SpmListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [daftar, setDaftar] = useState([]);
  const [loading, setLoading] = useState(user.role !== "kpa");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user.role === "kpa") return;
    getSpmList()
      .then((res) => setDaftar(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Gagal memuat daftar SPM"))
      .finally(() => setLoading(false));
  }, [user.role]);

  if (user.role === "kpa") {
    return (
      <div className="empty-state">
        <FiAlertCircle size={30} />
        <h3>Modul SPM tidak tersedia untuk peran KPA</h3>
        <p>Akun KPA belum memiliki menu pada fase pengujian ini.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: 0 }}>
          {ROLE_CONTEXT[user.role]}
        </p>
        {user.role === "maker" && (
          <button type="button" className="btn btn-gold" onClick={() => navigate("/spm/baru")}>
            <FiPlus size={15} />
            SPM Baru
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          <FiAlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="spin-center">
          <span className="spinner" />
          Memuat daftar SPM...
        </div>
      ) : daftar.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FiFileText size={30} />
            <h3>Belum ada SPM</h3>
            <p>
              {user.role === "maker"
                ? "Mulai dengan membuat SPM baru menggunakan tombol di atas."
                : "Belum ada SPM yang perlu ditindaklanjuti saat ini."}
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nomor Berkas</th>
                <th>Tipe DIPA</th>
                <th>Jenis SPM</th>
                <th>Status</th>
                <th>Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((spm) => (
                <tr key={spm.id} onClick={() => navigate(`/spm/${spm.id}`)}>
                  <td className="mono">{spm.id.slice(0, 8)}</td>
                  <td>{tipeDipaLabel(spm.tipe_dipa)}</td>
                  <td>{spm.jenis_spm}</td>
                  <td>
                    <StatusBadge status={spm.status} />
                  </td>
                  <td>{formatTanggal(spm.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
