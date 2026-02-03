import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert("Veuillez entrer votre email");

    try {
      setLoading(true);
      await api.post("/auth/users/reset_password/", { email });
      alert("Email de réinitialisation envoyé !");
      setEmail("");
    } catch (err) {
      const messages = Object.values(err.response?.data || {}).flat().join(" ");
      alert(messages || "Erreur lors de l’envoi");
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
          Mot de passe oublié
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-cyan-400 to-violet-500 text-white hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Réinitialiser"}
          </button>
        </form>

        <Link to="/" className="block text-center mt-6 text-white/70 hover:text-cyan-400 transition">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
