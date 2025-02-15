export interface AnimeEpisode {
  number: number;
  title: string;
  url: string;
  thumbnail: string;
  animeTitle: string;
}

export interface AnimeDetails {
  title: string;
  synopsis: string;
  cover: string;
  imageUrl: string;
  status: string;
  type: string;
  genres: string[];
  episodes: AnimeEpisode[];
  url: string;
  year: number;
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
