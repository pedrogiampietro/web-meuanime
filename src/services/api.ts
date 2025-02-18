import axios from "axios";
import { getFromCache, saveToCache } from "./cacheService";
import { SearchResponse, AnimeDetails, AnimeResponse } from "../types/anime";

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

    const tryProvider = async (provider: AnimeProvider) => {
      const cacheKey = `latestEpisodes_${provider}`;
      const cachedData = getFromCache<AnimeEpisode[]>(cacheKey, 30);

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
      const response = await axiosInstance.get(`/episodes/${anime}/${episode}`);

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
    try {
      const response = await axiosInstance.get(`/anime/${provider}/${query}`);

      if (response.data && response.data.length > 0) {
        return response.data;
      }
    } catch (error) {
      console.error(`Error searching anime on ${provider}:`, error);
      return null;
    }
  },

  searchAnimes: async (query: string): Promise<SearchResponse> => {
    try {
      const response = await axiosInstance.get<SearchResponse>(
        `/anime/goyabu/search?q=${encodeURIComponent(query)}`
      );

      return response.data;
    } catch (error) {
      console.error("Erro na busca:", error);
      throw new Error("Falha ao buscar animes");
    }
  },

  getAnimeDetails: async (slug: string): Promise<AnimeDetails> => {
    console.log("API - Iniciando busca de detalhes para slug:", slug);
    const cacheKey = `animeDetails_${slug}`;
    const cachedData = getFromCache<AnimeDetails>(cacheKey);

    if (cachedData) {
      console.log("API - Retornando dados do cache para:", slug);
      return cachedData;
    }

    try {
      const url = `/anime/goyabu/details/${encodeURIComponent(slug)}`;
      console.log("API - URL da requisição:", url);

      const response = await axiosInstance.get<AnimeDetails>(url);
      console.log("API - Status da resposta:", response.status);
      console.log("API - Dados recebidos:", response.data);

      if (!response.data) {
        console.log("API - Nenhum dado recebido");
        throw new Error("Dados do anime não encontrados");
      }

      saveToCache(cacheKey, response.data);
      return response.data;
    } catch (error: any) {
      console.error("API - Erro completo:", error);
      console.error("API - URL que falhou:", error.config?.url);
      console.error("API - Resposta de erro:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Falha ao carregar detalhes do anime"
      );
    }
  },

  getAnimes: async (
    provider: AnimeProvider,
    page: number
  ): Promise<ProviderResult<AnimeResponse>> => {
    const cacheKey = `animes_${provider}_page_${page}`;
    const cachedData = getFromCache<AnimeResponse>(cacheKey, 30); // cache por 30 minutos

    if (cachedData) {
      console.log(`Returning cached animes from ${provider} page ${page}`);
      return {
        data: cachedData,
        provider,
        success: true,
        loading: false,
        error: undefined,
      };
    }

    try {
      console.log(`Fetching animes from ${provider} page ${page}`);
      const response = await axiosInstance.get<AnimeResponse>(
        `/anime/${provider}/animes?page=${page}`
      );

      if (response.data) {
        saveToCache(cacheKey, response.data);
        return {
          data: response.data,
          provider,
          success: true,
          loading: false,
          error: undefined,
        };
      }

      throw new Error("Dados não encontrados");
    } catch (error) {
      console.error(`Error fetching animes from ${provider}:`, error);
      return {
        data: null,
        provider,
        success: false,
        loading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  },
};
