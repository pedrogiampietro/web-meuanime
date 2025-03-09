import { useState, useEffect } from "react";

export interface IMDBData {
  title: string;
  year: string;
  rating: string;
  duration: string;
  genres: string[];
  plot: string;
  poster: string | undefined;
  actors?: string[];
  released?: string;
  totalSeasons?: string;
  type?: string;
  imdbVotes?: string;
}

export const useIMDB = (title: string | undefined) => {
  const [imdbData, setImdbData] = useState<IMDBData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanTitle = (title: string) => {
    return (
      title
        // Remove números de episódios e temporadas
        .replace(/episódio\s+\d+/i, "")
        .replace(/episodio\s+\d+/i, "")
        .replace(/temporada\s+\d+/i, "")
        .replace(/season\s+\d+/i, "")
        // Remove sufixos comuns de anime
        .replace(/dublado/i, "")
        .replace(/-\s*\d+$/i, "") // Remove números no final após hífen
        .replace(/\s+\d+$/i, "") // Remove números soltos no final
        // Remove caracteres especiais e pontuação
        .replace(/[:.]/g, " ")
        // Remove texto entre parênteses
        .replace(/\([^)]*\)/g, "")
        // Remove texto entre colchetes
        .replace(/\[[^\]]*\]/g, "")
        // Limpa espaços extras
        .trim()
        // Remove espaços duplos
        .replace(/\s+/g, " ")
    );
  };

  const formatImdbData = (data: any): IMDBData => {
    const formatValue = (value: string): string | undefined =>
      value === "N/A" ? undefined : value;

    const formatYear = (year: string) => year?.replace("–", "").trim();

    const formatActors = (actors: string) =>
      formatValue(actors)
        ?.split(",")
        .map((a) => a.trim())
        .filter(Boolean) || [];

    return {
      title: data.Title,
      year: formatYear(data.Year),
      rating: formatValue(data.imdbRating) || "N/A",
      duration: formatValue(data.Runtime) || "N/A",
      genres: data.Genre.split(", "),
      plot: data.Plot,
      poster: formatValue(data.Poster),
      actors: formatActors(data.Actors),
      released: formatValue(data.Released),
      totalSeasons: formatValue(data.totalSeasons),
      type: formatValue(data.Type),
      imdbVotes: formatValue(data.imdbVotes),
    };
  };

  useEffect(() => {
    const fetchIMDBData = async () => {
      if (!title) return;

      const cleaned = cleanTitle(title);
      setIsLoading(true);
      setError(null);

      try {
        // Primeiro tenta buscar com o título exato
        const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(
          cleaned
        )}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.Response === "True") {
          const formattedData = formatImdbData(data);
          setImdbData(formattedData);
        } else {
          // Se não encontrar, tenta buscar removendo parte do título após ":"
          const simplifiedTitle = cleaned.split(":")[0].trim();
          if (simplifiedTitle !== cleaned) {
            const secondTryUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(
              simplifiedTitle
            )}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`;

            const secondResponse = await fetch(secondTryUrl);
            const secondData = await secondResponse.json();

            if (secondData.Response === "True") {
              const formattedData = formatImdbData(secondData);
              setImdbData(formattedData);
              return;
            }
          }

          setError(data.Error);
          setImdbData(null);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        setImdbData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIMDBData();
  }, [title]);

  return { imdbData, isLoading, error };
};
