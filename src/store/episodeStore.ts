import { create } from "zustand";
import { AnimeEpisode } from "../services/api";

interface EpisodeStore {
  currentEpisode: AnimeEpisode | null;
  setCurrentEpisode: (episode: AnimeEpisode) => void;
}

export const useEpisodeStore = create<EpisodeStore>((set) => ({
  currentEpisode: null,
  setCurrentEpisode: (episode) => set({ currentEpisode: episode }),
}));
