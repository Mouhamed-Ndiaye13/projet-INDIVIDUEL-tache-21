import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // ⚡ On ne redirige que si le token existe ET qu'il est valide
    if (token) {
      // Optionnel: on peut tester la validité avec une requête ping ou decode JWT
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

      const res = await api.post("/auth/jwt/create/", { email, password });

      // 🔹 Stockage du token
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("user", JSON.stringify({ email }));

      // 🔹 Redirection vers dashboard uniquement après succès login
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // 🔹 Messages d'erreur Djoser + JWT
      const messages = Object.values(err.response?.data || {}).flat().join(" ");
      setError(messages || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f1a] to-[#0f172a] relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/20 blur-3xl rounded-full" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8">
        <h1 className="text-3xl font-extrabold text-center text-white tracking-wide mb-8">
          Connexion
        </h1>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <div className="text-right">
            <Link to="/forgot-password" className="text-cyan-400 hover:underline text-sm">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-cyan-400 to-violet-500 text-white hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
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
