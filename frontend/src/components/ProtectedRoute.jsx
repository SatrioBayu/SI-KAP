import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiAlertTriangle } from "react-icons/fi";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="spin-center">
        <span className="spinner" />
        Memuat sesi...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function RoleGate({ roles, children }) {
  const { user } = useAuth();

  if (!roles.includes(user.role)) {
    return (
      <div className="empty-state">
        <FiAlertTriangle size={30} />
        <h3>Akses tidak diizinkan</h3>
        <p>Peran Anda ({user.role}) tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  return children;
}
