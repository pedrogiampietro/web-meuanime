export interface ConsumetResponse<T> {
  currentPage: number;
  hasNextPage: boolean;
  results: T[];
}

export interface AnimeResult {
  id: string;
  title: string;
  image: string;
  url: string;
  releaseDate?: string;
}

export interface Recent extends AnimeResult {
  episodeNumber: number;
  episodeId: string;
}

export interface TopAiring extends AnimeResult {
  genres: string[];
}

export interface Search extends AnimeResult {
  subOrDub: string;
}

export interface AnimeInfo {
  id: string;
  title: string;
  url: string;
  image: string;
  releaseDate: string;
  description: string;
  genres: string[];
  subOrDub: string;
  type: string;
  status: string;
  totalEpisodes: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  url: string;
}

export interface Watch {
  headers: {
    Referer: string;
  };
  sources: {
    url: string;
    quality: string;
    isM3U8: boolean;
  }[];
}
