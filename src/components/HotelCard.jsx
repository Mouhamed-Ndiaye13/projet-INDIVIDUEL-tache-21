export default function HotelCard({ hotel }) {
  // Image principale (fallback si aucune image)
  const coverImage =
    hotel.images && hotel.images.length > 0
      ? hotel.images[0]
      : "/placeholder-hotel.jpg"; // image par défaut

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
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={coverImage}
          alt={hotel.name}
          className="
            w-full h-full object-cover
            group-hover:scale-110
            transition-transform duration-700
          "
          onError={(e) => {
            e.target.src = "/placeholder-hotel.jpg";
          }}
        />

        {/* Overlay gradient */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t from-black/70 via-black/30 to-transparent
          "
        />
      </div>

      {/* Content */}
      <div className="relative p-5 space-y-2">
        <h3
          className="
            text-lg font-extrabold tracking-wide text-white
            group-hover:text-cyan-400 transition-colors
          "
        >
          {hotel.name}
        </h3>

        <p className="text-sm text-cyan-300/80 tracking-wide">
          {hotel.location}
        </p>

        <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
          {hotel.description}
        </p>

        {/* Badge images */}
        {hotel.images && hotel.images.length > 1 && (
          <span
            className="
              absolute top-3 right-3
              px-3 py-1 text-xs font-bold
              bg-black/60 text-cyan-300
              rounded-full backdrop-blur-md
            "
          >
            +{hotel.images.length - 1} images
          </span>
        )}

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
