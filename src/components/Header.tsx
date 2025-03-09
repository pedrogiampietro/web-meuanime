import { Link } from "react-router-dom";
import { SearchBar } from "./search/SearchBar";
import { LoginButton } from "./LoginButton";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zax-bg/95 z-50 border-b border-zax-button">
      <nav className="h-full px-4 mx-auto flex items-center justify-between max-w-[1920px]">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="logo.png" alt="Logo" className="h-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Zax Meu Anime
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <SearchBar />
          <LoginButton />
        </div>
      </nav>
    </header>
  );
}
