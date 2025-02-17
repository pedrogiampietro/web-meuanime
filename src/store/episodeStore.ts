import { create } from "zustand";

interface Episode {
  title: string;
  episode?: string;
  playerUrl: string;
  quality?: string;
}

interface EpisodeStore {
  currentEpisode: Episode | null;
  setCurrentEpisode: (episode: Episode) => void;
}

export const useEpisodeStore = create<EpisodeStore>((set) => ({
  currentEpisode: null,
  setCurrentEpisode: (episode) => set({ currentEpisode: episode }),
}));
