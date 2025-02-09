export interface MediaContent {
  id: number;
  title: string;
  imageUrl: string;
  type: "movie" | "series";
  rating: string;
  year: number;
}

export interface MediaCardProps {
  id: string;
  episodeId?: string;
  title: string;
  imageUrl: string;
  type: "movie" | "series" | "episode";
  rating: string;
  year: number;
  episodeNumber?: number;
}
