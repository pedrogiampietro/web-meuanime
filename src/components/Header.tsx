import { Link } from "react-router-dom";
import { SearchBar } from "./search/SearchBar";
import { LoginButton } from "./LoginButton";
import { UserProfile } from "./UserProfile";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zax-bg/95 z-50 border-b border-zax-button">
      <nav className="h-full px-4 mx-auto flex items-center max-w-[1920px]">
        {/* Left Section */}
        <div className="flex-[2] flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="logo.png" alt="Logo" className="h-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Zax Meu Anime
            </span>
          </Link>
        </div>

        {/* Right Section with Search and Profile */}
        <div className="flex-1 flex items-center justify-end gap-6">
          <SearchBar />
          {user ? <UserProfile /> : <LoginButton />}
        </div>
      </nav>
    </header>
  );
}
