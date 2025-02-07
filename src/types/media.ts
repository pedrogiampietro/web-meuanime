export interface MediaContent {
  id: number;
  title: string;
  imageUrl: string;
  type: "movie" | "series";
  rating: string;
  year: number;
}
