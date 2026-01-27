import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Appel API login
      const res = await api.post("/users/login/", { email, password });

      // Vérifier si le token est présent
      if (!res.data.token) {
        setError("Impossible de récupérer le token");
        return;
      }

      // 🔐 Sauvegarde du token et info user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirection vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      // Gestion d'erreur plus claire
      const message =
        err.response?.data?.error ||
        err.message ||
        "Email ou mot de passe incorrect";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f1a] to-[#0f172a] relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/20 blur-3xl rounded-full" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8">
        <h1 className="text-3xl font-extrabold text-center text-white tracking-wide mb-8">
          Connexion <span className="text-cyan-400">Admin</span>
        </h1>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="exemple@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-cyan-400 to-violet-500 text-white hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between mt-6 text-sm">
          <Link
            to="/forgot-password"
            className="text-white/60 hover:text-cyan-400 transition"
          >
            Mot de passe oublié ?
          </Link>
          <Link
            to="/register"
            className="text-white/60 hover:text-cyan-400 transition"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
