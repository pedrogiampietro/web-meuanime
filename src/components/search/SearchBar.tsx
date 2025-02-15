import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { SearchResult } from "../../types/anime";
import { useDebounce } from "../../hooks/useDebounce";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const searchAnimes = useCallback(async (searchQuery: string) => {
    if (searchQuery.length >= 3) {
      setIsLoading(true);
      try {
        const data = await api.searchAnimes(searchQuery);
        setResults(data.results);
      } catch (error) {
        console.error("Erro ao buscar:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
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
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Buscar animes..."
          className="w-full px-4 py-2 bg-zax-bg rounded-lg text-zax-text focus:outline-none focus:ring-2 focus:ring-zax-primary"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-zax-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-zax-bg/95 backdrop-blur rounded-lg overflow-hidden z-50 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-track-zax-bg scrollbar-thumb-purple-500/20 hover:scrollbar-thumb-purple-500/30">
            {results.map((result) => (
              <div
                key={result.slug}
                onClick={() => handleSelectAnime(result.slug)}
                className="p-4 hover:bg-purple-500/5 cursor-pointer flex items-center gap-4 transition-all duration-200 border-b border-purple-500/10 last:border-none group"
              >
                <div className="w-14 h-20 flex-shrink-0 overflow-hidden rounded-md shadow-md group-hover:shadow-purple-500/20 transition-all">
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
                  <span className="text-zax-text/60 text-sm mt-1 inline-block bg-purple-500/5 px-2 py-0.5 rounded-full">
                    {result.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
