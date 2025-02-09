import { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { animeApi } from "../../services/api";
import type { IAnimeResult } from "@consumet/extensions";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IAnimeResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchAnime = async () => {
      if (searchTerm.length < 3) {
        setResults([]);
        return;
      }

      try {
        const results = await animeApi.searchAnime(searchTerm);
        setResults(results.results || []);
      } catch (error) {
        console.error("Erro na busca:", error);
      }
    };

    const debounceTimeout = setTimeout(searchAnime, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-zax-text hover:text-white transition-colors"
        >
          <FiSearch className="w-6 h-6" />
        </button>
      ) : (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "300px", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="flex items-center"
        >
          <div className="flex items-center bg-zax-secondary rounded-lg w-full">
            <FiSearch className="w-5 h-5 text-zax-text ml-3" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar títulos..."
              className="bg-transparent text-white px-3 py-2 w-full focus:outline-none"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                setSearchTerm("");
              }}
              className="px-3 text-zax-text hover:text-white"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-zax-secondary rounded-lg shadow-lg overflow-hidden"
              >
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 p-3 hover:bg-zax-button cursor-pointer transition-colors"
                  >
                    <img
                      src={result.image}
                      alt={
                        typeof result.title === "string"
                          ? result.title
                          : result.title.userPreferred || ""
                      }
                      className="w-20 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="text-white font-medium">
                        {typeof result.title === "string"
                          ? result.title
                          : result.title.userPreferred || ""}
                      </h4>
                      <p className="text-sm text-zax-text">
                        {result.type || "Unknown"} •{" "}
                        {result.releaseDate || "Unknown"}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
