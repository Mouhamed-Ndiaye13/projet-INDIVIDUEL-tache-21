import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ActivateAccount() {
  const { uid, token } = useParams();
  const [status, setStatus] = useState("pending"); // pending, success, error
  const navigate = useNavigate();

  useEffect(() => {
    const activate = async () => {
      try {
        await api.post(`/users/activate/${uid}/${token}/`);
        setStatus("success");

        // Redirection vers la page login après 2 secondes
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch {
        setStatus("error");
      }
    };
    activate();
  }, [uid, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f1a] to-[#0f172a]">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl text-center text-white">
        {status === "pending" && <p>Activation en cours...</p>}
        {status === "success" && (
          <p className="text-green-400 mb-4">
            Compte activé avec succès ! Redirection vers la connexion...
          </p>
        )}
        {status === "error" && <p className="text-red-400">Lien d’activation invalide ou expiré.</p>}
      </div>
    </div>
  );
}
