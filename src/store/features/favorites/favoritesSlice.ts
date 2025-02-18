import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  StoredFavorite,
  storageService,
} from "../../../services/storageService";

interface FavoritesState {
  items: StoredFavorite[];
}

const initialState: FavoritesState = {
  items: storageService.getFavorites(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<StoredFavorite>) => {
      const currentFavorites = storageService.getFavorites();

      const exists = currentFavorites.some(
        (item) => String(item.id) === String(action.payload.id)
      );

      if (!exists) {
        const updatedFavorites = [...currentFavorites, action.payload];
        state.items = updatedFavorites;
        storageService.saveFavorites(updatedFavorites);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const currentFavorites = storageService.getFavorites();

      const updatedFavorites = currentFavorites.filter(
        (item) => String(item.id) !== String(action.payload)
      );

      state.items = updatedFavorites;
      storageService.saveFavorites(updatedFavorites);
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
