import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaComment, FaEnvelope, FaUserCog, FaSignOutAlt } from "react-icons/fa";

interface NavBarProps {
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-green-600 to-green-400 shadow-lg w-full" // ❌ REMOVED: fixed top-0 left-0 z-50
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* LOGO */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white text-2xl font-bold tracking-wide"
        >
          ♻️ EcoRutas
        </motion.h1>

        {/* MENÚ */}
        <ul className="flex items-center space-x-6 text-white font-semibold">
          <li>
            <Link
              to="/calendar"
              className="hover:text-yellow-200 transition-colors flex items-center gap-2"
            >
              <FaCalendarAlt /> Calendario
            </Link>
          </li>
          <li>
            <Link
              to="/comments"
              className="hover:text-yellow-200 transition-colors flex items-center gap-2"
            >
              <FaComment /> Comentarios
            </Link>
          </li>
          <li>
            <Link
              to="/messages"
              className="hover:text-yellow-200 transition-colors flex items-center gap-2"
            >
              <FaEnvelope /> Mensajes
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className="hover:text-yellow-200 transition-colors flex items-center gap-2"
            >
              <FaUserCog /> Admin
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogoutClick}
              className="hover:text-yellow-200 transition-colors flex items-center gap-2"
            >
              <FaSignOutAlt /> Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default NavBar;