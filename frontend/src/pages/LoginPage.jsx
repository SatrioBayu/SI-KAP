import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/spm" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate("/spm", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal masuk. Periksa kembali koneksi Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-visual">
        <div>
          <div className="login-visual-seal">SK</div>
          <h2>Sistem Informasi Keuangan &amp; Akuntansi Pemerintahan</h2>
          <p>
            Mengelola alur SPM, DIPA, dan capaian IKPA Pengadilan Tinggi Tata
            Usaha Negara Makassar dalam satu berkas digital yang tertelusur
            dari Maker hingga KPA.
          </p>
        </div>
        <div className="login-visual-foot">
          PTTUN Makassar &middot; Kepaniteraan &amp; Kesekretariatan
        </div>
      </div>

      <div className="login-form-wrap">
        <div className="login-form-card">
          <h1>Masuk ke SI-KAP</h1>
          <p>Gunakan akun yang telah diberikan oleh administrator.</p>

          {error && (
            <div className="alert alert-danger">
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="input"
                type="text"
                autoComplete="username"
                placeholder="mis. maker"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">
                Kata sandi
              </label>
              <input
                id="password"
                className="input"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary login-submit" disabled={submitting}>
              <FiLock size={14} />
              {submitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="field-hint" style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 6 }}>
            <FiUser size={13} /> Login menggunakan username, bukan email.
          </p>
        </div>
      </div>
    </div>
  );
}
