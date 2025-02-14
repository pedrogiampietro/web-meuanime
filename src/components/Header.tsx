import { Link } from "react-router-dom";
import { SearchBar } from "./search/SearchBar";
import { useAuth } from "../contexts/AuthContext";
import { FiLogOut } from "react-icons/fi";

export function Header() {
  const { user, openAuthModal, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zax-bg/95 z-50 border-b border-zax-button">
      <nav className="h-full px-4 mx-auto flex items-center justify-between max-w-[1920px]">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img
              src="https://placehold.co/120x40/794de2/ffffff/png?text=MeuAnime Zax"
              alt="Logo"
              className="h-8"
            />
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <SearchBar />
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white">{user.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-zax-button text-white px-4 py-2 rounded-lg hover:bg-zax-primary transition-colors"
              >
                <FiLogOut />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="bg-zax-button text-white px-4 py-2 rounded-lg hover:bg-zax-primary transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
