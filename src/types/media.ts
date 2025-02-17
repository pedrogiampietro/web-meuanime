export interface MediaContent {
  id: number;
  title: string;
  imageUrl: string;
  type: "movie" | "animes";
  rating: string;
  year: number;
}

export interface MediaCardProps {
  id: string;
  episodeId?: string;
  title: string;
  imageUrl: string;
  type: "movie" | "animes" | "episode";
  rating: string;
  year: number;
  episodeNumber?: number;
}
