import { Navigate, Outlet } from "react-router-dom";

// Vérifie si l'utilisateur est connecté (token présent dans localStorage)
export default function PrivateRoute() {
  const token = localStorage.getItem("access"); // token JWT
  return token ? <Outlet /> : <Navigate to="/" replace />;
}
