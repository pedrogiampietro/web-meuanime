import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../search/SearchBar";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import { motion } from "framer-motion";

interface NetflixLayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: NetflixLayoutProps) {
  const { isExpanded } = useSidebar();

  return (
    <div className="min-h-screen bg-zax-bg">
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
            <button className="bg-zax-button text-white px-4 py-2 rounded-lg hover:bg-zax-primary transition-colors">
              Entrar
            </button>
          </div>
        </nav>
      </header>

      <div className="flex pt-16">
        <Sidebar />
        <motion.main
          animate={{ marginLeft: isExpanded ? "256px" : "72px" }}
          className="flex-1"
        >
          {children}
        </motion.main>
      </div>

      <footer className="bg-[#141414] text-gray-400 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm">&copy; 2024 Netflix Clone</p>
        </div>
      </footer>
    </div>
  );
}

export function NetflixLayout({ children }: NetflixLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
