import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, RoleGate } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SpmListPage from "./pages/SpmListPage";
import SpmFormPage from "./pages/SpmFormPage";
import SpmDetailPage from "./pages/SpmDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/spm" replace />} />
            <Route path="/spm" element={<SpmListPage />} />
            <Route
              path="/spm/baru"
              element={
                <RoleGate roles={["maker"]}>
                  <SpmFormPage />
                </RoleGate>
              }
            />
            <Route path="/spm/:id" element={<SpmDetailPage />} />
            <Route
              path="/spm/:id/edit"
              element={
                <RoleGate roles={["maker"]}>
                  <SpmFormPage />
                </RoleGate>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
