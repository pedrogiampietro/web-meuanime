import { ProviderResult } from "../services/api";

export interface AnimeEpisode {
  number: number;
  title: string;
  url: string;
  thumbnail: string;
  animeTitle: string;
}

export interface AnimeDetails {
  id: string;
  title: string;
  image: string;
  synopsis: string;
  year: string;
  type: string;
  status?: string;
  genres: string[];
  episodes: {
    number: string;
    title: string;
    link: string;
    playerUrl: string;
  }[];
}

export interface SearchResult {
  title: string;
  link: string;
  image: string;
  type: string;
  slug: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export interface AnimeResponse {
  page: number;
  animes: {
    title: string;
    link: string;
    image: string;
    type: string;
    slug: string;
  }[];
}

export interface Anime {
  id: string;
  title: string;
  url?: string;
  thumbnail?: string;
  animeTitle?: string;
  number?: number;
  imageUrl?: string;
  type?: string;
  rating?: string;
  year?: string;
}

export interface AnimeListItem {
  title: string;
  link: string;
  image: string;
  type: string;
  slug: string;
  episode?: string;
  quality?: string;
  playerUrl?: string;
  provider?: string;
}

export type ProviderAnimeResult = Omit<ProviderResult<AnimeEpisode>, "data"> & {
  data: AnimeListItem[] | null;
};

export interface WatchHistory {
  user_id: string;
  anime_id: string;
  episode_number: number;
  progress_percentage: number;
  watched_at: string;
}

export interface WatchHistoryResponse {
  id: string;
  user_id: string;
  anime_id: string;
  episode_number: number;
  progress_percentage: number;
  watched_at: string;
  created_at: string;
  updated_at: string;
}

export interface AnimeWatchStatus {
  lastWatchedEpisode: number;
  progress_percentage: number;
  watched_at: string;
}
