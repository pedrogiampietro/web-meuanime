import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

export type AnimeProvider = "animesonlinecc" | "goyabu";

export interface AnimeEpisode {
  title: string;
  episode: string;
  link: string;
  image: string;
  quality: string;
  playerUrl: string;
  provider: AnimeProvider;
}

// Interface para o objeto de cache
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Função auxiliar para gerenciar o cache
function getFromCache<T>(key: string, expirationMinutes: number = 5): T | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const item: CacheItem<T> = JSON.parse(cached);
  const now = new Date().getTime();
  const expirationTime = expirationMinutes * 60 * 1000;

  if (now - item.timestamp > expirationTime) {
    localStorage.removeItem(key);
    return null;
  }

  return item.data;
}

function setCache<T>(key: string, data: T): void {
  const item: CacheItem<T> = {
    data,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export interface ProviderResult<T> {
  data: T | null;
  provider: AnimeProvider;
  success: boolean;
  loading: boolean;
  error?: string;
}

export const api = {
  getLatestEpisodes: async (
    preferredProvider: AnimeProvider = "goyabu"
  ): Promise<ProviderResult<AnimeEpisode[]>[]> => {
    const providers: AnimeProvider[] = ["animesonlinecc", "goyabu"];
    // Inicializa todos os providers com status inicial
    const results: ProviderResult<AnimeEpisode[]>[] = providers.map(
      (provider) => ({
        data: null,
        provider,
        success: false,
        loading: provider === preferredProvider, // Apenas o provider preferido começa como loading
        error: undefined,
      })
    );

    try {
      const response = await axiosInstance.get<AnimeEpisode[]>(
        `/anime/${preferredProvider}/latest`
      );
      const data = response.data.map((episode) => ({
        ...episode,
        provider: preferredProvider,
      }));
      setCache(`latestEpisodes_${preferredProvider}`, data);

      // Atualiza apenas o status do provider que foi requisitado
      const providerIndex = results.findIndex(
        (r) => r.provider === preferredProvider
      );
      results[providerIndex] = {
        data,
        provider: preferredProvider,
        success: true,
        loading: false,
      };

      return results;
    } catch (error) {
      // Em caso de erro, atualiza apenas o provider que foi requisitado
      const providerIndex = results.findIndex(
        (r) => r.provider === preferredProvider
      );
      results[providerIndex] = {
        data: null,
        provider: preferredProvider,
        success: false,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      return results;
    }
  },

  getEpisode: async (anime: string, episode: string) => {
    try {
      console.log("Fetching episode:", { anime, episode });
      const response = await axiosInstance.get(`/episodes/${anime}/${episode}`);
      console.log("Episode response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getEpisode:", error);
      throw error;
    }
  },

  getEpisodeById: async (id: string): Promise<AnimeEpisode> => {
    const cacheKey = `episode_${id}`;
    const cachedData = getFromCache<AnimeEpisode>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await axiosInstance.get<AnimeEpisode>(`/episodes/${id}`);
    setCache(cacheKey, response.data);
    return response.data;
  },
};

export default api;
