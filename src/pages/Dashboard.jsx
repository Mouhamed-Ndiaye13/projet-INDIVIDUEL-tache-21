import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  FaWpforms,
  FaEnvelope,
  FaUsers,
  FaMailBulk,
  FaHotel,
  FaBuilding,
} from "react-icons/fa";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [hotelCount, setHotelCount] = useState(0); // état pour le nombre d'hôtels

  // Récupérer les hôtels depuis le backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const token = localStorage.getItem("token"); // token stocké après login
        const res = await fetch("https://projet-individuel-tache-21.onrender.com/api/hotels/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // envoie le token pour sécuriser
          },
        });
        if (!res.ok) throw new Error("Erreur lors de la récupération des hôtels");
        const data = await res.json();
        setHotelCount(data.hotels.length); // nombre réel d'hôtels
      } catch (err) {
        console.error(err);
      }
    };

    fetchHotels();
  }, []);

  const stats = [
    {
      id: 1,
      title: "Formulaires reçus",
      value: 0,
      icon: <FaWpforms />,
      color: "cyan",
    },
    {
      id: 2,
      title: "Messages reçus",
      value: 0,
      icon: <FaEnvelope />,
      color: "emerald",
    },
    {
      id: 3,
      title: "Utilisateurs",
      value: 0,
      icon: <FaUsers />,
      color: "violet",
    },
    {
      id: 4,
      title: "Mails",
      value: 0,
      icon: <FaMailBulk />,
      color: "rose",
    },
    {
      id: 5,
      title: "Hôtels",
      value: hotelCount, // <-- ici on met le nombre dynamique
      icon: <FaHotel />,
      color: "amber",
    },
    {
      id: 6,
      title: "Entités",
      value: 0,
      icon: <FaBuilding />,
      color: "sky",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#0f172a]">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">
        <Header title="Tableau de bord" open={open} setOpen={setOpen} />

        <main className="p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-10 tracking-wide">
            Bienvenue sur <span className="text-cyan-400">RED PRODUCT</span>
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="
                group relative overflow-hidden
                rounded-2xl p-6
                bg-white/10 backdrop-blur-xl
                border border-white/10
                shadow-[0_0_30px_rgba(0,0,0,0.6)]
                hover:shadow-[0_0_40px_rgba(56,189,248,0.6)]
                transition-all duration-500
                "
              >
                {/* Glow background */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-${stat.color}-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative flex items-center gap-5">
                  {/* Icon */}
                  <div
                    className={`p-4 rounded-2xl bg-${stat.color}-500/20 text-${stat.color}-400 text-3xl shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-110 transition-transform duration-500`}
                  >
                    {stat.icon}
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-white/70 font-medium tracking-wide">{stat.title}</p>
                    <p className="text-4xl font-extrabold text-white mt-1">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
