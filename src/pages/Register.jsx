import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);

      // Appel API pour enregistrer l'utilisateur
      const res = await api.post("/users/register/", {
        name,
        email,
        password,
      });

      // Optionnel : si tu veux sauvegarder le token maintenant pour rester connecté
      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔑 Redirection vers Login avec replace: true pour bloquer le back
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || "Erreur lors de l’inscription"
      );
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
          Inscription <span className="text-cyan-400">Admin</span>
        </h1>

        {/* ❌ Erreur */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 transition"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 transition"
          />

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-cyan-400 to-violet-500 text-white hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Inscription..." : "S’inscrire"}
          </button>
        </form>

        <p className="text-center mt-6 text-white/70">
          Déjà un compte ?{" "}
          <Link to="/" className="text-cyan-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
