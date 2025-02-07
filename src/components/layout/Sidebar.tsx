import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BiMoviePlay } from "react-icons/bi";
import { MdLocalMovies, MdFavorite } from "react-icons/md";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-zax-secondary border-r border-zax-button overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 text-zax-text hover:text-white hover:bg-zax-button rounded-lg p-3 transition-all"
          >
            <AiFillHome className="text-xl" />
            <span>Início</span>
          </Link>

          <Link
            to="/series"
            className="flex items-center gap-3 text-zax-text hover:text-white hover:bg-zax-button rounded-lg p-3 transition-all"
          >
            <BiMoviePlay className="text-xl" />
            <span>Séries</span>
          </Link>

          <Link
            to="/filmes"
            className="flex items-center gap-3 text-zax-text hover:text-white hover:bg-zax-button rounded-lg p-3 transition-all"
          >
            <MdLocalMovies className="text-xl" />
            <span>Filmes</span>
          </Link>
        </nav>

        <div className="mt-8">
          <h3 className="text-zax-text text-sm font-medium mb-4 px-3">
            Minhas Listas
          </h3>
          <nav className="space-y-1">
            <Link
              to="/favoritos"
              className="flex items-center gap-3 text-zax-text hover:text-white hover:bg-zax-button rounded-lg p-3 transition-all"
            >
              <MdFavorite className="text-xl" />
              <span>Favoritos</span>
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}
