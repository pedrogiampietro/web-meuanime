import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

export type AnimeProvider = "animesonlinecc" | "goyabu";

export interface AnimeEpisode {
  title: string;
  episode: string;
  link: string;
  image: string;
  quality: string;
  playerUrl: string;
  provider: AnimeProvider;
}

export const api = {
  getLatestEpisodes: async (
    provider: AnimeProvider = "animesonlinecc"
  ): Promise<AnimeEpisode[]> => {
    const response = await axiosInstance.get<AnimeEpisode[]>(
      `/anime/${provider}/latest`
    );
    return response.data.map((episode) => ({ ...episode, provider }));
  },

  getEpisode: async (anime: string, episode: string) => {
    try {
      console.log("Fetching episode:", { anime, episode });
      const response = await axiosInstance.get(`/episodes/${anime}/${episode}`);
      console.log("Episode response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getEpisode:", error);
      throw error;
    }
  },
};

export default api;
