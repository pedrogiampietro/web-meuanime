const FAVORITES_KEY = "@zax-animes:favorites";

export interface StoredFavorite {
  id: string;
  title: string;
  imageUrl: string;
  type: "movie" | "animes" | "episode";
  rating: string;
  year: string;
}

export const storageService = {
  getFavorites: (): StoredFavorite[] => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveFavorites: (favorites: StoredFavorite[]): void => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  },
};
