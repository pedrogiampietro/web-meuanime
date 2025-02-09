import type {
  AnimeInfo,
  ConsumetResponse,
  Recent,
  Search,
  TopAiring,
} from "../types/consumet";
import // ... other imports
// Remove Watch from here
"@consumet/extensions";
import type { IAnimeEpisode } from "@consumet/extensions";

export interface AnimeDetails {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  coverImage: string;
  genres: string[];
  type: string;
  status: string;
  releaseDate: string;
  rating: string;
  episodes: {
    id: string;
    number: string;
    title: string;
    thumbnail: string;
  }[];
  duration: string;
}

const API_URL = "https://kitsu.io/api/edge";

const fetchWithHeaders = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface AdaptedEpisode {
  id: string;
  number: string;
  title: string;
  url: string;
  thumbnail: string;
}

// Adaptar a resposta da API do Enime para nosso formato
const adaptAnimeData = (data: any): AnimeInfo => {
  console.log("📝 Adapting anime data:", data);

  const animeData = data.data || data;
  const attrs = animeData.attributes || {};

  // Função para gerar uma URL de thumbnail única para cada episódio
  const getEpisodeThumbnail = (episodeNumber: number) => {
    const thumbnails = [
      attrs.posterImage?.large,
      attrs.coverImage?.large,
      attrs.episodeScreenshots?.[episodeNumber - 1],
      // Adicione mais fontes de imagens aqui se disponíveis
    ];
    return thumbnails.find(Boolean) || "";
  };

  const episodeCount = attrs.episodeCount || 0;
  const episodes: AdaptedEpisode[] = Array.from(
    { length: episodeCount },
    (_, i) => ({
      id: `${animeData.id}-${i + 1}`,
      number: String(i + 1),
      title: `Episode ${i + 1}`,
      url: "", // Add required field
      thumbnail: getEpisodeThumbnail(i + 1),
    })
  );

  const result = {
    id: animeData.id,
    slug: attrs.slug || "",
    title:
      attrs.titles?.en_jp ||
      attrs.titles?.en ||
      attrs.canonicalTitle ||
      "Unknown",
    description: attrs.synopsis || attrs.description || "",
    image: attrs.posterImage?.original || attrs.posterImage?.large || "",
    coverImage:
      attrs.coverImage?.original ||
      attrs.coverImage?.large ||
      attrs.posterImage?.original ||
      attrs.posterImage?.large ||
      "",
    genres: attrs.categories?.map((cat: any) => cat.title) || [],
    type: attrs.showType || "TV",
    status:
      attrs.status === "finished"
        ? "Completed"
        : attrs.status === "current"
        ? "Ongoing"
        : attrs.status || "Unknown",
    releaseDate: attrs.startDate || "",
    rating: attrs.averageRating
      ? `${(Number(attrs.averageRating) / 10).toFixed(1)}/10`
      : "N/A",
    episodes,
    duration: attrs.episodeLength ? `${attrs.episodeLength} min` : "Unknown",
  };

  console.log("✨ Adapted result:", result);
  console.log("✨ Cover Image URL:", result.coverImage); // Para debug
  return {
    ...result,
    url: "",
    subOrDub: "sub",
    totalEpisodes: result.episodes.length,
    episodes: episodes.map((ep) => ({
      ...ep,
      number: parseInt(ep.number) || 0,
    })) as IAnimeEpisode[],
  } as unknown as AnimeInfo;
};

interface Source {
  url: string;
  quality: string;
  isM3U8: boolean;
}

interface Watch {
  headers: {
    Referer: string;
  };
  sources: Source[];
}

export const animeApi = {
  getTrending: async (page = 1): Promise<ConsumetResponse<TopAiring>> => {
    const data = await fetchWithHeaders(
      `${API_URL}/anime?sort=-userCount&page[limit]=20&page[offset]=${
        (page - 1) * 20
      }`
    );
    return {
      currentPage: page,
      hasNextPage: data.links?.next !== undefined,
      results: data.data.map(adaptAnimeData),
    };
  },

  getRecentEpisodes: async (page = 1): Promise<ConsumetResponse<Recent>> => {
    const data = await fetchWithHeaders(
      `${API_URL}/anime?sort=-startDate&page[limit]=20&page[offset]=${
        (page - 1) * 20
      }`
    );
    return {
      currentPage: page,
      hasNextPage: data.links?.next !== undefined,
      results: data.data.map(adaptAnimeData),
    };
  },

  searchAnime: async (
    query: string,
    page = 1
  ): Promise<ConsumetResponse<Search>> => {
    const data = await fetchWithHeaders(
      `${API_URL}/anime?filter[text]=${query}&page[limit]=20&page[offset]=${
        (page - 1) * 20
      }`
    );
    return {
      currentPage: page,
      hasNextPage: data.links?.next !== undefined,
      results: data.data.map(adaptAnimeData),
    };
  },

  getAnimeInfo: async (animeId: string): Promise<AnimeInfo> => {
    console.log("🔍 Getting anime info for ID:", animeId);

    try {
      const [animeData, categories, episodes] = await Promise.all([
        fetchWithHeaders(`${API_URL}/anime/${animeId}`),
        fetchWithHeaders(`${API_URL}/anime/${animeId}/categories`),
        fetchWithHeaders(`${API_URL}/anime/${animeId}/episodes`),
      ]);

      const data = animeData.data;
      data.attributes.categories = categories.data;
      data.attributes.episodeScreenshots = episodes.data?.map(
        (ep: any) => ep.attributes?.thumbnail?.original
      );

      return adaptAnimeData(data);
    } catch (error) {
      console.log("⚠️ Failed to fetch by ID, trying by slug...");
      // Se falhar, tenta buscar por slug
      const searchData = await fetchWithHeaders(
        `${API_URL}/anime?filter[slug]=${animeId}`
      );

      if (searchData.data && searchData.data[0]) {
        const animeId = searchData.data[0].id;
        const [animeData, categories] = await Promise.all([
          fetchWithHeaders(`${API_URL}/anime/${animeId}`),
          fetchWithHeaders(`${API_URL}/anime/${animeId}/categories`),
        ]);

        const data = animeData.data;
        data.attributes.categories = categories.data;

        return adaptAnimeData(data);
      }

      if (!searchData.data || searchData.data.length === 0) {
        console.error("❌ No anime found for:", animeId);
      }

      throw new Error("Anime not found");
    }
  },

  getAnimeDetails: async (animeId: string): Promise<AnimeInfo> => {
    const data = await fetchWithHeaders(`${API_URL}/anime/${animeId}`);
    return adaptAnimeData(data);
  },

  getEpisodeSources: async (
    episodeId: string,
    server = "default"
  ): Promise<Watch> => {
    const API_BASE = "/anime";

    console.log("🎬 Tentando obter fontes para episódio:", {
      episodeId,
      server,
    });

    try {
      // Extrair o slug do anime e número do episódio
      const match = episodeId.match(/(.+)-episode-(\d+)$/);
      if (!match) {
        throw new Error("Formato de ID inválido");
      }

      const animeSlug = match[1];
      const episodeNumber = match[2];
      console.log("🔍 Buscando anime:", { animeSlug, episodeNumber });

      // Busca o anime pelo slug
      const searchResponse = await fetch(`${API_BASE}/info/${animeSlug}`);

      if (!searchResponse.ok) {
        throw new Error(`Anime não encontrado: ${searchResponse.status}`);
      }

      const animeData = await searchResponse.json();
      console.log("✅ Dados do anime:", animeData);

      // Busca as fontes do episódio
      const sourcesResponse = await fetch(
        `${API_BASE}/watch/${animeSlug}-episode-${episodeNumber}`
      );

      if (!sourcesResponse.ok) {
        throw new Error(`Fontes não encontradas: ${sourcesResponse.status}`);
      }

      const sourcesData = await sourcesResponse.json();
      console.log("✅ Fontes obtidas:", sourcesData);

      if (!sourcesData.sources || !Array.isArray(sourcesData.sources)) {
        throw new Error("Formato de resposta inválido");
      }

      // Formata a resposta no formato esperado
      return {
        headers: {
          Referer: "https://gogoanime.tel",
        },
        sources: sourcesData.sources.map((source: Source) => ({
          url: source.url,
          quality: source.quality,
          isM3U8: source.isM3U8,
        })),
      };
    } catch (error) {
      console.error("❌ Erro ao processar fontes:", error);
      throw error;
    }
  },

  getGenreList: async () => {
    const response = await fetch(`${API_URL}/genre`);
    return response.json();
  },

  getAnimesByGenre: async (
    genre: string,
    page = 1
  ): Promise<ConsumetResponse<Search>> => {
    const response = await fetch(`${API_URL}/genre/${genre}?page=${page}`);
    const data = await response.json();
    return {
      currentPage: page,
      hasNextPage: data.hasNextPage,
      results: data.data.map(adaptAnimeData),
    };
  },
};
