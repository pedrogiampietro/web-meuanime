import { useState, useEffect } from "react";
import { api, ProviderResult } from "../services/api";
import { AnimeResponse } from "../types/anime";

interface Anime {
  title: string;
  link: string;
  image: string;
  type: string;
  slug: string;
}

export function useAnimes(initialPage = 1) {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [providerResults, setProviderResults] = useState<
    ProviderResult<AnimeResponse>[]
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
    async function fetchAnimes() {
      setLoading(true);

      // Tenta primeiro o Goyabu
      setProviderResults((prev) =>
        prev.map((p) => (p.provider === "goyabu" ? { ...p, loading: true } : p))
      );

      const goyabuResult = await api.getAnimes("goyabu", page);
      setProviderResults((prev) =>
        prev.map((p) => (p.provider === "goyabu" ? goyabuResult : p))
      );

      // Se o Goyabu falhou, tenta o AnimesOnlineCC
      if (!goyabuResult.success) {
        setProviderResults((prev) =>
          prev.map((p) =>
            p.provider === "animesonlinecc" ? { ...p, loading: true } : p
          )
        );

        const animesonlineccResult = await api.getAnimes(
          "animesonlinecc",
          page
        );
        setProviderResults((prev) =>
          prev.map((p) =>
            p.provider === "animesonlinecc" ? animesonlineccResult : p
          )
        );

        if (animesonlineccResult.success && animesonlineccResult.data) {
          setAnimes(animesonlineccResult.data.animes);
          setError(null);
        } else {
          setError("Nenhum provider disponível");
        }
      } else if (goyabuResult.data) {
        setAnimes(goyabuResult.data.animes);
        setError(null);
      }

      setLoading(false);
    }

    fetchAnimes();
  }, [page]);

  return { animes, loading, error, page, setPage, providerResults };
}
