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
  });

  const API_URL = "https://projet-individuel-tache-21.onrender.com/api";
  const MEDIA_URL = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  // ----------------------------
  // Charger les hôtels
  // ----------------------------
  useEffect(() => {
    fetch(`${API_URL}/hotels/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // ajouter URL complète aux images
          const formatted = data.hotels.map((h) => ({
            ...h,
            images: h.images.map((img) => `${MEDIA_URL}${img}`),
          }));
          setHotels(formatted);
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
      newHotel.images.length === 0
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const formData = new FormData();
    formData.append("name", newHotel.name);
    formData.append("location", newHotel.location);
    formData.append("description", newHotel.description);
    formData.append("price", 0);

    newHotel.images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await fetch(`${API_URL}/hotels/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        const hotelFormatted = {
          ...data.hotel,
          images: data.hotel.images.map((img) => `${MEDIA_URL}${img}`),
        };

        setHotels([...hotels, hotelFormatted]);
        setModalOpen(false);
        setNewHotel({
          name: "",
          location: "",
          description: "",
          images: [],
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Nos <span className="text-cyan-400">Hôtels</span>
              </h1>
              <p className="text-white/60 mt-2">
                Gestion des hôtels avec images locales
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-white font-semibold"
            >
              + Ajouter un hôtel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setModalOpen(false)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 z-50">
            <h2 className="text-2xl font-bold text-white mb-6">
              Ajouter un hôtel
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nom"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20"
                value={newHotel.name}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Localisation"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20"
                value={newHotel.location}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, location: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20"
                value={newHotel.description}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, description: e.target.value })
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

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-white font-semibold"
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
