import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BiMoviePlay } from "react-icons/bi";
import { MdLocalMovies, MdFavorite } from "react-icons/md";
import { FiChevronLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSidebar } from "../../contexts/SidebarContext";

export function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isExpanded ? 256 : 72 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-zax-secondary border-r border-zax-button overflow-hidden"
    >
      <div className="p-4 relative">
        <button
          onClick={toggleSidebar}
          className="absolute right-4 top-4 text-zax-text hover:text-white transition-colors"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronLeft className="w-5 h-5" />
          </motion.div>
        </button>

        <nav className="space-y-1 mt-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-zax-text hover:text-white hover:bg-zax-button rounded-lg p-3 transition-all group"
          >
            <AiFillHome className="text-xl flex-shrink-0" />
            <motion.span
              animate={{ opacity: isExpanded ? 1 : 0 }}
              className="whitespace-nowrap"
            >
              Início
            </motion.span>
          </Link>

          <Link
            to="/animes"
            className="flex items-center gap-3 text-zax-text hover:text-white hover:bg-zax-button rounded-lg p-3 transition-all"
          >
            <BiMoviePlay className="text-xl flex-shrink-0" />
            <motion.span
              animate={{ opacity: isExpanded ? 1 : 0 }}
              className="whitespace-nowrap"
            >
              Animes
            </motion.span>
          </Link>

          {/* <Link
            to="/filmes"
            className="flex items-center gap-3 text-zax-text hover:text-white hover:bg-zax-button rounded-lg p-3 transition-all"
          >
            <MdLocalMovies className="text-xl flex-shrink-0" />
            <motion.span
              animate={{ opacity: isExpanded ? 1 : 0 }}
              className="whitespace-nowrap"
            >
              Filmes
            </motion.span>
          </Link> */}
        </nav>

        <motion.div animate={{ opacity: isExpanded ? 1 : 0 }} className="mt-8">
          <h3 className="text-zax-text text-sm font-medium mb-4 px-3">
            Minhas Listas
          </h3>
          <nav className="space-y-1">
            <Link
              to="/favoritos"
              className="flex items-center gap-3 text-zax-text hover:text-white hover:bg-zax-button rounded-lg p-3 transition-all"
            >
              <MdFavorite className="text-xl flex-shrink-0" />
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0 }}
                className="whitespace-nowrap"
              >
                Favoritos
              </motion.span>
            </Link>
          </nav>
        </motion.div>
      </div>
    </motion.aside>
  );
}
