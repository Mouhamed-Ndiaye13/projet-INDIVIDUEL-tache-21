import React from "react";

export default function HotelCard({ hotel }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all duration-300">
      
      {/* Image principale */}
      {hotel.images && hotel.images.length > 0 ? (
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-white">
          Pas d'image
        </div>
      )}

      <div className="p-4">
        {/* Nom de l'hôtel */}
        <h3 className="text-lg font-bold text-white">{hotel.name}</h3>

        {/* Localisation */}
        <p className="text-white/70 mt-1">{hotel.location}</p>

        {/* Catégorie */}
        {hotel.category && (
          <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-cyan-400/20 text-cyan-400">
            {hotel.category}
          </span>
        )}

        {/* Prix */}
        <p className="mt-2 text-white font-semibold">{hotel.price} € / nuit</p>
      </div>
    </div>
  );
}
