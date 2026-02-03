import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirm) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      // Djoser attend password et re_password pour certains backends
      await api.post("/auth/users/reset_password_confirm/", { uid, token, new_password: password });
      setMessage("Mot de passe réinitialisé avec succès !");
      setPassword("");
      setConfirm("");
    } catch (err) {
      if (err.response?.data) {
        const messages = Object.values(err.response.data)
          .flat()
          .join(" ");
        setError(messages || "Lien invalide ou expiré");
      } else {
        setError("Lien invalide ou expiré");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f1a] to-[#0f172a] relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/20 blur-3xl rounded-full" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl text-center text-white">
        <h1 className="text-3xl font-bold mb-6">Réinitialiser le mot de passe</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {message && <p className="text-green-400 mb-4">{message}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-400 to-violet-500 text-white hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </form>

        <Link to="/" className="block mt-6 text-cyan-400 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
