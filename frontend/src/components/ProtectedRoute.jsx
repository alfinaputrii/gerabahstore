import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Ambil data user dari localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Cek apakah sudah login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Cek role (kalau allowedRoles disediakan)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect ke halaman sesuai role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
