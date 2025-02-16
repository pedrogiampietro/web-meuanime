export interface AnimeEpisode {
  number: number;
  title: string;
  url: string;
  thumbnail: string;
  animeTitle: string;
}

export interface AnimeDetails {
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
  number: number;
  title: string;
  url: string;
  thumbnail: string;
  animeTitle: string;
}
