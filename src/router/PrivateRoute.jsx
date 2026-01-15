import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const isAuth = true; // temporaire

  return isAuth ? <Outlet /> : <Navigate to="/" />;
}
