import axios from "axios";
import { getFromCache, saveToCache } from "./cacheService";
import {
  SearchResponse,
  AnimeDetails,
  AnimeResponse,
  AnimeListItem,
  WatchHistory,
  WatchHistoryResponse,
  AnimeWatchStatus,
} from "../types/anime";

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:3000/api"
    : "https://server-meuanime-production.up.railway.app/api",
});

// Adiciona o token de autenticação em todas as requisições
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("@meuanime:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//https://animeshd.to

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

  getTrendingAnimes: async (
    preferredProvider: AnimeProvider = "goyabu"
  ): Promise<ProviderResult<AnimeListItem[]>[]> => {
    const providers: AnimeProvider[] = ["animesonlinecc", "goyabu"];

    const tryProvider = async (provider: AnimeProvider) => {
      const cacheKey = `trending_${provider}`;
      const cachedData = getFromCache<AnimeListItem[]>(cacheKey, 30);

      if (cachedData && cachedData.length > 0) {
        console.log(`Returning cached trending data from ${provider}`);
        return cachedData;
      }

      try {
        console.log(`Fetching trending data from ${provider}`);
        const response = await axiosInstance.get<AnimeListItem[]>(
          `/anime/${provider}/trending`
        );

        if (response.data && response.data.length > 0) {
          saveToCache(cacheKey, response.data);
          return response.data;
        }
        return null;
      } catch (error) {
        console.error(`Error fetching trending from ${provider}:`, error);
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
        console.log(
          `Trying alternative provider for trending: ${alternativeProvider}`
        );
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
        provider === successProvider && !data
          ? "No trending data available"
          : undefined,
    }));
  },

  getUserWatchHistory: async (
    userId: string
  ): Promise<WatchHistoryResponse[]> => {
    try {
      console.log("📝 Fetching watch history for user:", userId);
      const response = await axiosInstance.get<WatchHistoryResponse[]>(
        `/watch-history/${userId}`
      );
      console.log("✅ Watch history fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching watch history:", {
        error,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },

  createOrUpdateWatchHistory: async (
    watchData: WatchHistory
  ): Promise<WatchHistoryResponse> => {
    try {
      console.log("📝 Creating/updating watch history:", watchData);

      // Verificar se todos os campos necessários estão presentes
      if (!watchData.user_id) {
        console.error("❌ Missing user_id in watch data");
        throw new Error("Missing user_id in watch data");
      }

      if (!watchData.anime_id) {
        console.error("❌ Missing anime_id in watch data");
        throw new Error("Missing anime_id in watch data");
      }

      if (
        watchData.episode_number === undefined ||
        watchData.episode_number === null
      ) {
        console.error("❌ Missing episode_number in watch data");
        throw new Error("Missing episode_number in watch data");
      }

      // Verificar se episode_number é um número válido
      if (isNaN(Number(watchData.episode_number))) {
        console.error(
          "❌ Invalid episode_number in watch data:",
          watchData.episode_number
        );
        throw new Error(`Invalid episode_number: ${watchData.episode_number}`);
      }

      // Fazer a requisição POST
      console.log(
        "🔄 Sending POST request to /watch-history with data:",
        watchData
      );
      const response = await axiosInstance.post<WatchHistoryResponse>(
        "/watch-history",
        watchData
      );

      console.log(
        "✅ Watch history created/updated successfully:",
        response.data
      );
      return response.data;
    } catch (error: any) {
      // Verificar se é um erro de duplicação
      if (
        error.response?.status === 400 &&
        error.response?.data?.error?.includes("duplicate key value")
      ) {
        console.log(
          "ℹ️ Episódio já está no histórico, não é necessário salvar novamente"
        );

        // Buscar o registro existente para retornar
        try {
          const existingRecords = await axiosInstance.get<
            WatchHistoryResponse[]
          >(`/watch-history/${watchData.user_id}`);

          const existingRecord = existingRecords.data.find(
            (record) =>
              record.anime_id === watchData.anime_id &&
              record.episode_number === watchData.episode_number
          );

          if (existingRecord) {
            return existingRecord;
          }
        } catch (fetchError) {
          console.error("❌ Error fetching existing record:", fetchError);
        }

        // Se não conseguir buscar o registro existente, cria um mock
        return {
          id: "existing-record",
          user_id: watchData.user_id,
          anime_id: watchData.anime_id,
          episode_number: watchData.episode_number,
          progress_percentage: watchData.progress_percentage,
          watched_at: watchData.watched_at,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      console.error("❌ Error creating/updating watch history:", {
        error,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
        watchData,
      });
      throw error;
    }
  },

  getAnimeWatchStatus: async (
    userId: string,
    animeId: string
  ): Promise<AnimeWatchStatus> => {
    try {
      console.log("📝 Fetching anime watch status:", { userId, animeId });
      const response = await axiosInstance.get<AnimeWatchStatus>(
        `/watch-history/${userId}/${animeId}`
      );
      console.log("✅ Anime watch status fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching anime watch status:", {
        error,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },
};
