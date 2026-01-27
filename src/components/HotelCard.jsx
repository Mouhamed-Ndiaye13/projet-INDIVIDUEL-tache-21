export default function HotelCard({ hotel }) {
  return (
    <div
      className="
      group relative overflow-hidden rounded-2xl
      bg-white/10 backdrop-blur-xl
      border border-white/10
      shadow-[0_0_30px_rgba(0,0,0,0.6)]
      hover:shadow-[0_0_40px_rgba(56,189,248,0.6)]
      transition-all duration-500
      "
    >
      {/* Image principale */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={hotel.images[0] || "/placeholder.png"} // ⚡ utilise la première image
          alt={hotel.name}
          className="
          w-full h-full object-cover
          group-hover:scale-110
          transition-transform duration-700
          "
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-5 space-y-2">
        <h3 className="text-lg font-extrabold tracking-wide text-white group-hover:text-cyan-400 transition-colors">
          {hotel.name}
        </h3>

        <p className="text-sm text-cyan-300/80 tracking-wide">{hotel.location}</p>

        <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
          {hotel.description}
        </p>

        {/* Hover glow */}
        <div
          className="
          absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          shadow-[inset_0_0_40px_rgba(56,189,248,0.3)]
          pointer-events-none
          "
        />
      </div>
    </div>
  );
}
