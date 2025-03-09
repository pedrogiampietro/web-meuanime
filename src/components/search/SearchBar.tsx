import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { SearchResult } from "../../types/anime";
import { useDebounce } from "../../hooks/useDebounce";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const searchAnimes = useCallback(async (searchQuery: string) => {
    if (searchQuery.length >= 3) {
      setIsLoading(true);
      try {
        const data = await api.searchAnimes(searchQuery);
        setResults(data.results);
        setIsOpen(true);
      } catch (error) {
        console.error("Erro ao buscar:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  const debouncedSearch = useDebounce(searchAnimes, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSelectAnime = (slug: string) => {
    navigate(`/anime/${slug}`);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Buscar animes..."
          className="w-full px-4 py-3 bg-zax-bg rounded-lg text-zax-text focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 placeholder:text-zax-text/50"
          aria-label="Buscar animes"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {results.length > 0 && isOpen && (
        <div className="absolute w-full mt-2 bg-zax-bg/95 backdrop-blur-lg rounded-lg overflow-hidden z-50 border border-purple-500/20 shadow-lg transform transition-all duration-200 ease-in-out">
          <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-track-zax-bg scrollbar-thumb-purple-500/20 hover:scrollbar-thumb-purple-500/30">
            {results.map((result) => (
              <div
                key={result.slug}
                onClick={() => handleSelectAnime(result.slug)}
                className="p-4 hover:bg-purple-500/10 cursor-pointer flex items-center gap-4 transition-all duration-200 border-b border-purple-500/10 last:border-none group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSelectAnime(result.slug)
                }
              >
                <div className="w-14 h-20 flex-shrink-0 overflow-hidden rounded-md shadow-md group-hover:shadow-purple-500/30 transition-all duration-300 transform group-hover:scale-105">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-zax-text font-medium line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {result.title}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-zax-text/60 text-sm bg-purple-500/10 px-3 py-1 rounded-full group-hover:bg-purple-500/20 transition-colors">
                      {result.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
