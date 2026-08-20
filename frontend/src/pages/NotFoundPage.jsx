import { Link } from "react-router-dom";
import { FiCompass } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="empty-state" style={{ paddingTop: 120 }}>
      <FiCompass size={30} />
      <h3>Halaman tidak ditemukan</h3>
      <p>
        <Link to="/spm">Kembali ke daftar SPM</Link>
      </p>
    </div>
  );
}
