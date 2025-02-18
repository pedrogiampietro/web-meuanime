import { useState, useEffect } from "react";
import { api, ProviderResult } from "../services/api";
import { AnimeListItem } from "../types/anime";

export function useTrendingAnimes() {
  const [trending, setTrending] = useState<AnimeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerResults, setProviderResults] = useState<
    ProviderResult<AnimeListItem[]>[]
  >([
    {
      data: null,
      provider: "goyabu",
      success: false,
      loading: true,
      error: undefined,
    },
    {
      data: null,
      provider: "animesonlinecc",
      success: false,
      loading: false,
      error: undefined,
    },
  ]);

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      try {
        const results = await api.getTrendingAnimes("goyabu");
        setProviderResults(results);

        const successfulProvider = results.find(
          (r) => r.success && r.data?.length
        );
        if (successfulProvider?.data) {
          setTrending(successfulProvider.data);
          setError(null);
        } else {
          setError("Nenhum provider disponível");
        }
      } catch (error) {
        setError("Erro ao carregar trending animes");
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  return { trending, loading, error, providerResults };
}
