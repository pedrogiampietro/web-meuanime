import axios from "axios";
import { getFromCache, saveToCache } from "./cacheService"; // Supondo que você tenha um serviço de cache

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
    const cacheKey = `latestEpisodes_${preferredProvider}`;

    // Aumentamos o tempo de expiração para 30 minutos
    const cachedData = getFromCache<AnimeEpisode[]>(cacheKey, 30);
    console.log("Cache Key:", cacheKey);
    console.log("Cached Data:", cachedData);

    if (cachedData) {
      console.log("Returning cached data");
      const providers: AnimeProvider[] = ["animesonlinecc", "goyabu"];
      return providers.map((provider) => ({
        data: provider === preferredProvider ? cachedData : null,
        provider,
        success: provider === preferredProvider,
        loading: false,
        error: undefined,
      }));
    }

    console.log("No cache found, fetching new data");
    const providers: AnimeProvider[] = ["animesonlinecc", "goyabu"];
    const results: ProviderResult<AnimeEpisode[]>[] = providers.map(
      (provider) => ({
        data: null,
        provider,
        success: false,
        loading: provider === preferredProvider,
        error: undefined,
      })
    );

    try {
      const response = await axiosInstance.get<AnimeEpisode[]>(
        `/anime/${preferredProvider}/latest`
      );

      const providerIndex = results.findIndex(
        (r) => r.provider === preferredProvider
      );

      results[providerIndex] = {
        data: response.data,
        provider: preferredProvider,
        success: true,
        loading: false,
        error: undefined,
      };

      console.log("Saving data to cache");
      saveToCache(cacheKey, response.data);

      return results;
    } catch (error) {
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

async function fetchData(url: string) {
  // Verifica se os dados estão no cache
  const cachedData = getFromCache(url);
  if (cachedData) {
    return cachedData;
  }

  // Se não estiver no cache, faz a requisição
  const response = await fetch(url);
  const data = await response.json();

  // Salva os dados no cache
  saveToCache(url, data);

  return data;
}
