import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ⚡ Vérifie qu'il y a un token ET que l'utilisateur est activé
  if (!token || !user?.is_active) {
    return <Navigate to="/" replace />;
  }

  return children;
}
