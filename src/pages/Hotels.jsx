import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import HotelCard from "../components/HotelCard";

export default function Hotels() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hotels, setHotels] = useState([]);

  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    description: "",
    images: [],
    price: "0",
  });

  const API_URL = "https://projet-individuel-tache-21.onrender.com/api";

  // ----------------------------
  // Charger les hôtels
  // ----------------------------
  useEffect(() => {
    fetch(`${API_URL}/hotels/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setHotels(data.hotels);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // ----------------------------
  // Ajouter un hôtel
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newHotel.name ||
      !newHotel.location ||
      !newHotel.description ||
      !newHotel.price ||
      newHotel.images.length === 0
    ) {
      alert("Tous les champs + au moins une image sont obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("name", newHotel.name);
    formData.append("location", newHotel.location);
    formData.append("description", newHotel.description);
    formData.append("price", String(newHotel.price));
    newHotel.images.forEach((img) => formData.append("images", img));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour ajouter un hôtel");
        return;
      }

      const res = await fetch(`${API_URL}/hotels/create/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        setHotels((prev) => [...prev, data.hotel]);
        setModalOpen(false);
        setNewHotel({
          name: "",
          location: "",
          description: "",
          images: [],
          price: "0",
        });
      } else {
        alert(data.error || "Erreur lors de l'ajout");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#0f172a]">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">
        <Header title="Hôtels" open={open} setOpen={setOpen} />

        <main className="p-6 md:p-10">
          {/* Header + Bouton */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Nos <span className="text-cyan-400">Hôtels</span>
              </h1>
              <p className="text-white/60 mt-2">
                Gestion des hôtels avec Cloudinary
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-white font-semibold
                         shadow-[0_0_30px_rgba(56,189,248,0.6)]
                         hover:shadow-[0_0_40px_rgba(56,189,248,0.8)] hover:scale-[1.05]
                         transition-all duration-300"
            >
              + Ajouter un hôtel
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </main>
      </div>

      {/* Modal Ajouter Hôtel */}
      {modalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10
                          rounded-2xl p-6 md:p-8 z-50 overflow-y-auto max-h-[90vh] shadow-[0_0_40px_rgba(0,0,0,0.6)]">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Ajouter un hôtel
              </h2>
              <button
                className="text-white text-2xl font-bold hover:text-red-400 transition"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nom"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
                value={newHotel.name}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Localisation"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
                value={newHotel.location}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, location: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition resize-none"
                value={newHotel.description}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, description: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Prix"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
                value={newHotel.price}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, price: e.target.value })
                }
              />

              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full text-white"
                onChange={(e) =>
                  setNewHotel({
                    ...newHotel,
                    images: Array.from(e.target.files),
                  })
                }
              />

              {newHotel.images.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {newHotel.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-xl border border-white/20"
                    />
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-white font-semibold
                           hover:shadow-[0_0_30px_rgba(56,189,248,0.8)]
                           transition-all duration-300"
              >
                Ajouter
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
