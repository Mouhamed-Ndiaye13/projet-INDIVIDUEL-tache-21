import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaHotel, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `
    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
    ${
      isActive
        ? "bg-white/20 backdrop-blur-md shadow-[0_0_25px_rgba(56,189,248,0.6)]"
        : "hover:bg-white/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
    }
    `;

  const iconClass = `
    p-2 rounded-lg bg-white/20 backdrop-blur-md
    group-hover:scale-110 group-hover:rotate-3
    transition-all duration-300
  `;

  // ---------------------------
  // LOGOUT FUNCTION
  // ---------------------------
  const handleLogout = () => {
    // 1️⃣ Supprimer token et user
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2️⃣ Redirection forcée vers login et remplacement de l'historique
    navigate("/", { replace: true });

    // 3️⃣ Bloquer le retour arrière (bonus)
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 bottom-0 h-screen w-64 z-50 
        bg-gradient-to-b from-[#0b0f1a]/80 to-[#0f172a]/80
        backdrop-blur-xl border-r border-white/10
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static
        flex flex-col p-5
        `}
      >
        {/* Logo */}
        <h2 className="text-2xl font-extrabold text-white mb-10 tracking-widest hidden md:block">
          RED <span className="text-cyan-400">HOTEL</span>
        </h2>

        {/* Links */}
        <NavLink
          to="/dashboard"
          className={linkClass}
          onClick={() => setOpen(false)}
        >
          <div className={iconClass}>
            <FaHome className="text-cyan-400" />
          </div>
          <span className="text-white tracking-wide">Dashboard</span>
        </NavLink>

        <NavLink
          to="/hotels"
          className={linkClass}
          onClick={() => setOpen(false)}
        >
          <div className={iconClass}>
            <FaHotel className="text-violet-400" />
          </div>
          <span className="text-white tracking-wide">Hôtels</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
          mt-auto flex items-center gap-3 px-4 py-3 rounded-xl
          bg-red-500/10 text-red-400
          hover:bg-red-500/20
          hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]
          transition-all duration-300
          "
        >
          <div className="p-2 rounded-lg bg-red-500/20">
            <FaSignOutAlt />
          </div>
          Déconnexion
        </button>
      </div>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
