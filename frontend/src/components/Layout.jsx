import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiFileText, FiPlusCircle, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const PAGE_META = {
  "/spm": { eyebrow: "Modul SPM", title: "Daftar Surat Perintah Membayar" },
  "/spm/baru": { eyebrow: "Modul SPM", title: "Ajukan SPM Baru" },
};

function initials(nama = "") {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

const ROLE_LABEL = {
  maker: "Maker",
  checker: "Checker",
  approver: "Approver",
  kpa: "KPA",
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const meta =
    PAGE_META[location.pathname] ||
    (location.pathname.endsWith("/edit")
      ? { eyebrow: "Modul SPM", title: "Ubah SPM" }
      : location.pathname.startsWith("/spm/")
        ? { eyebrow: "Modul SPM", title: "Detail SPM" }
        : { eyebrow: "SI-KAP", title: "" });

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-seal">SK</div>
          <div className="sidebar-brand-text">
            <h1>SI-KAP</h1>
            <p>PTTUN Makassar</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/spm"
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            <FiFileText size={16} />
            <span>Daftar SPM</span>
          </NavLink>
          {user?.role === "maker" && (
            <NavLink
              to="/spm/baru"
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            >
              <FiPlusCircle size={16} />
              <span>Buat SPM Baru</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">{initials(user?.nama)}</div>
            <div>
              <div className="sidebar-user-name">{user?.nama}</div>
              <div className="sidebar-user-role">{ROLE_LABEL[user?.role] || user?.role}</div>
            </div>
          </div>
          <button type="button" className="sidebar-logout" onClick={handleLogout}>
            <FiLogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="main-area">
        {meta.title && (
          <header className="topbar">
            <div>
              <p className="topbar-eyebrow">{meta.eyebrow}</p>
              <h2>{meta.title}</h2>
            </div>
          </header>
        )}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
