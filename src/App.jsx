import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages publiques
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ActivateAccount from "./pages/ActivateAccount";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";

// Pages protégées
import Dashboard from "./pages/Dashboard";
import Hotels from "./pages/Hotels";

// Route privée
import PrivateRoute from "./router/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 Routes publiques */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔑 Activation du compte */}
        <Route path="/activate/:uid/:token" element={<ActivateAccount />} />

        {/* 🔑 Reset password */}
        <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />

        {/* 🔒 Routes protégées */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hotels" element={<Hotels />} />
        </Route>

        {/* 🔄 Catch-all pour rediriger les URLs inconnues vers login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
