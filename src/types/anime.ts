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
