import axios from "axios";
import { getFromCache, saveToCache } from "./cacheService";

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
    const results: ProviderResult<AnimeEpisode[]>[] = providers.map(
      (provider) => ({
        data: null,
        provider,
        success: false,
        loading: provider === preferredProvider,
        error: undefined,
      })
    );

    const tryProvider = async (provider: AnimeProvider) => {
      const cacheKey = `latestEpisodes_${provider}`;
      const cachedData = getFromCache<AnimeEpisode[]>(cacheKey, 30);

      console.log(`Trying provider: ${provider}`);
      console.log("Cache Key:", cacheKey);
      console.log("Cached Data:", cachedData);

      if (cachedData && cachedData.length > 0) {
        console.log(`Returning cached data from ${provider}`);
        return cachedData;
      }

      try {
        console.log(`Fetching new data from ${provider}`);
        const response = await axiosInstance.get<AnimeEpisode[]>(
          `/anime/${provider}/latest`
        );

        if (response.data && response.data.length > 0) {
          console.log(`Saving data from ${provider} to cache`);
          saveToCache(cacheKey, response.data);
          return response.data;
        }
        return null;
      } catch (error) {
        console.error(`Error fetching from ${provider}:`, error);
        return null;
      }
    };

    let data = await tryProvider(preferredProvider);
    let successProvider = preferredProvider;

    if (!data || data.length === 0) {
      const alternativeProvider = providers.find(
        (p) => p !== preferredProvider
      );
      if (alternativeProvider) {
        console.log(`Trying alternative provider: ${alternativeProvider}`);
        data = await tryProvider(alternativeProvider);
        if (data && data.length > 0) {
          successProvider = alternativeProvider;
        }
      }
    }

    return providers.map((provider) => ({
      data: provider === successProvider ? data : null,
      provider,
      success: provider === successProvider && !!data,
      loading: false,
      error:
        provider === successProvider && !data ? "No data available" : undefined,
    }));
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
    saveToCache(cacheKey, response.data);
    return response.data;
  },

  searchAnime: async (query: string, provider: AnimeProvider) => {
    const cacheKey = `search_${provider}_${query}`;
    const cachedData = getFromCache<AnimeEpisode[]>(cacheKey, 30);

    if (cachedData && cachedData.length > 0) {
      console.log(`Returning cached search results for ${provider}`);
      return cachedData;
    }

    try {
      console.log(`Fetching new search results from ${provider}`);
      const response = await axiosInstance.get(`/anime/${provider}/${query}`);

      if (response.data && response.data.length > 0) {
        console.log(`Saving search results from ${provider} to cache`);
        saveToCache(cacheKey, response.data);
      }

      return response.data;
    } catch (error) {
      console.error(`Error searching anime on ${provider}:`, error);
      return null;
    }
  },
};
