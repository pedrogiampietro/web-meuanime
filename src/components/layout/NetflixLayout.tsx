import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../search/SearchBar";
import { Sidebar } from "./Sidebar";

interface NetflixLayoutProps {
  children: ReactNode;
}

export function NetflixLayout({ children }: NetflixLayoutProps) {
  return (
    <div className="min-h-screen bg-zax-bg">
      <header className="fixed top-0 left-0 right-0 h-16 bg-zax-bg/95 z-50 border-b border-zax-button">
        <nav className="h-full px-4 mx-auto flex items-center justify-between max-w-[1920px]">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button className="text-zax-text hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link to="/" className="flex items-center">
              <img
                src="https://placehold.co/120x40/794de2/ffffff/png?text=ZAX"
                alt="Logo"
                className="h-8"
              />
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <SearchBar />
            <button className="bg-zax-button text-white px-4 py-2 rounded-lg hover:bg-zax-primary transition-colors">
              Entrar
            </button>
          </div>
        </nav>
      </header>

      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64">{children}</main>
      </div>

      <footer className="bg-[#141414] text-gray-400 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm">&copy; 2024 Netflix Clone</p>
        </div>
      </footer>
    </div>
  );
}
