import { Navigate, Outlet } from "react-router-dom";

// Composant pour protéger les routes
export default function PrivateRoute() {
  const token = localStorage.getItem("token");

  // Si pas de token → redirection vers login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Sinon, on affiche les routes enfants
  return <Outlet />;
}
