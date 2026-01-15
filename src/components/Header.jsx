import { FaBars } from "react-icons/fa";

export default function Header({ title, open, setOpen }) {
  return (
    <header
      className="
      w-full sticky top-0 z-40
      bg-gradient-to-r from-[#0b0f1a]/80 to-[#0f172a]/80
      backdrop-blur-xl
      border-b border-white/10
      shadow-[0_0_30px_rgba(0,0,0,0.6)]
      "
    >
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Hamburger menu mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="
            md:hidden p-3 rounded-xl
            bg-white/10 backdrop-blur-md
            text-cyan-400
            hover:bg-white/20
            hover:shadow-[0_0_20px_rgba(56,189,248,0.6)]
            transition-all duration-300
            "
          >
            <FaBars />
          </button>

          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-white">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-white/70 tracking-wide">
            Bienvenue,
            <span className="text-cyan-400 font-semibold ml-1">
              Utilisateur
            </span>
          </span>

          {/* Avatar */}
          <div
            className="
            w-10 h-10 rounded-full
            bg-gradient-to-br from-cyan-400/30 to-violet-500/30
            backdrop-blur-md
            border border-white/20
            shadow-[0_0_20px_rgba(56,189,248,0.5)]
            "
          />
        </div>
      </div>
    </header>
  );
}
