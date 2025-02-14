import { FeaturedSection } from "../components/sections/FeaturedSection";
import { HeroSlider } from "../components/hero/HeroSlider";
import { api } from "../services/api";
import { MediaCard } from "../components/cards/MediaCard";
import { useQuery } from "@tanstack/react-query";
import type { AnimeEpisode } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface FormattedEpisode {
  id: number;
  episodeId: string;
  title: string;
  imageUrl: string;
  type: "episode";
  year: number;
  rating: string;
  episodeNumber: string;
  href: string;
  episodeData: AnimeEpisode;
}

interface LastWatchedEpisode extends AnimeEpisode {
  link: string;
}

export function Home() {
  const {
    data: recentEpisodes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recentEpisodes"],
    queryFn: async () => {
      try {
        const data = await api.getLatestEpisodes();
        return data;
      } catch (err) {
        console.error("Error fetching episodes:", err);
        throw err;
      }
    },
  });

  const formatEpisodeData = (episode: AnimeEpisode): FormattedEpisode => {
    const match = episode.title.match(/(.*?)(?:\s*Episodio\s*(\d+))?$/i);
    const baseTitle = match ? match[1].trim() : episode.title;
    const episodeNumber = episode.episode || match?.[2] || "1";

    // Limpar e formatar o link corretamente
    const cleanLink = episode.link
      .replace(/^https?:\/\/[^/]+\//, "") // Remove o domínio
      .replace(/^episodio\//, "") // Remove o prefixo 'episodio/'
      .replace(/\/$/, ""); // Remove a barra final se existir

    const href = `/watch/${cleanLink}`;

    return {
      id: Date.now(),
      title: baseTitle,
      imageUrl: episode.image,
      type: "episode",
      year: new Date().getFullYear(),
      rating: "0",
      episodeNumber,
      href,
      episodeData: {
        ...episode,
        title: baseTitle,
        link: cleanLink, // Link limpo sem o prefixo 'episodio/'
      },
    };
  };

  const navigate = useNavigate();

  const handleLastWatchedClick = (episode: AnimeEpisode) => {
    setCurrentEpisode(episode);
    setTimeout(() => {
      navigate(`/watch/${episode.link}`);
    }, 0);
  };

  return (
    <div className="relative">
      <HeroSlider />
      <FeaturedSection />

      {/* Latest Episodes Section */}
      <section className="px-8 py-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Últimos Episódios
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-zax-primary border-t-transparent"></div>
          </div>
        ) : isError ? (
          <div className="text-center text-zax-text py-12">
            <p>Erro ao carregar episódios recentes</p>
            <button
              onClick={() => refetch()}
              className="mt-4 text-white hover:text-zax-primary transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentEpisodes?.map((episode) => {
              const formattedData = formatEpisodeData(episode);
              return (
                <MediaCard
                  key={`${episode.title}-${episode.episode}`}
                  {...formattedData}
                  onClick={() => handleLastWatchedClick(episode)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
