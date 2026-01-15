import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import HotelCard from "../components/HotelCard";

export default function Hotels() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [hotels, setHotels] = useState([
    {
      id: 1,
      name: "Hôtel Lux",
      location: "Paris",
      description: "Hôtel 5 étoiles au cœur de Paris",
      image: "https://source.unsplash.com/600x400/?luxury,hotel",
    },
    {
      id: 2,
      name: "Hôtel Ocean",
      location: "Nice",
      description: "Vue imprenable sur la mer Méditerranée",
      image: "https://source.unsplash.com/600x401/?hotel,sea",
    },
    {
      id: 3,
      name: "Sky Palace",
      location: "Dubaï",
      description: "Hôtel futuriste avec vue panoramique",
      image: "https://source.unsplash.com/600x402/?futuristic,hotel",
    },
  ]);

  // Champs du formulaire modal
  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    description: "",
    image: "",
  });

  const handleAddHotel = () => {
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHotel.name || !newHotel.location || !newHotel.description || !newHotel.image) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    setHotels([...hotels, { id: Date.now(), ...newHotel }]);
    setNewHotel({ name: "", location: "", description: "", image: "" });
    setModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#0f172a]">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">
        <Header title="Hôtels" open={open} setOpen={setOpen} />

        <main className="p-6 md:p-10">
          {/* Title + Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">
                Nos <span className="text-cyan-400">Hôtels</span>
              </h1>
              <p className="text-white/60 mt-2 max-w-xl">
                Découvrez et gérez vos établissements dans une interface
                futuriste et premium.
              </p>
            </div>

            {/* Bouton Ajouter */}
            <button
              onClick={handleAddHotel}
              className="
                px-6 py-3 rounded-xl
                bg-gradient-to-r from-cyan-400 to-violet-500
                text-white font-semibold
                shadow-[0_0_30px_rgba(56,189,248,0.6)]
                hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(56,189,248,0.8)]
                transition-all duration-300
              "
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

      {/* Modal */}
      {modalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setModalOpen(false)}
          ></div>

          {/* Modal content */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10
            rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8 z-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Ajouter un hôtel</h2>
              <button
                className="text-white text-xl font-bold hover:text-red-400 transition"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nom de l'hôtel"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
                value={newHotel.name}
                onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Localisation"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
                value={newHotel.location}
                onChange={(e) => setNewHotel({...newHotel, location: e.target.value})}
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
                value={newHotel.description}
                onChange={(e) => setNewHotel({...newHotel, description: e.target.value})}
              />
              <input
                type="text"
                placeholder="URL de l'image"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
                value={newHotel.image}
                onChange={(e) => setNewHotel({...newHotel, image: e.target.value})}
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold tracking-wide
                  bg-gradient-to-r from-cyan-400 to-violet-500
                  text-white
                  hover:shadow-[0_0_30px_rgba(56,189,248,0.8)]
                  hover:scale-[1.02]
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
