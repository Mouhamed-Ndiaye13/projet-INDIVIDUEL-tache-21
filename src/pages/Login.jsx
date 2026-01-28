import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ⚡ Redirection si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/users/login/", { email, password });

      // 🔐 Sauvegarde token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔑 Redirection vers dashboard avec replace: true
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || "Erreur lors de la connexion"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f1a] to-[#0f172a]">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Connexion
        </h1>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
          />

          {/* Lien Mot de passe oublié */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-cyan-400 hover:underline text-sm"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-400 to-violet-500 text-white hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center mt-6 text-white/70">
          Pas de compte ?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
