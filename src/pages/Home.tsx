import { FeaturedSection } from "../components/sections/FeaturedSection";
import { HeroSlider } from "../components/hero/HeroSlider";
import { api } from "../services/api";
import { MediaCard } from "../components/cards/MediaCard";

import type { AnimeEpisode, ProviderResult } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEpisodeStore } from "../store/episodeStore";
import { useState, useEffect } from "react";
import { ProviderStatus } from "../components/ProviderStatus";
import { slugify } from "../utils/slugify";
import { useAnalytics } from "../hooks/useAnalytics";

interface FormattedEpisode {
  id: string;
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

export function Home() {
  const { trackPageView, trackEvent } = useAnalytics();
  const [isLoading, setIsLoading] = useState(true);
  const [_, setProviderResults] = useState<ProviderResult<AnimeEpisode[]>[]>([
    {
      data: null,
      provider: "animesonlinecc",
      success: false,
      loading: false,
      error: undefined,
    },
    {
      data: null,
      provider: "goyabu",
      success: false,
      loading: true,
      error: undefined,
    },
  ]);
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);

  useEffect(() => {
    trackPageView("/");

    async function loadEpisodes() {
      try {
        const results = await api.getLatestEpisodes("goyabu");

        setProviderResults(results);

        const successfulProvider = results.find(
          (r) => r.success && r.data?.length
        );
        if (successfulProvider?.data) {
          setEpisodes(successfulProvider.data);
        }
      } catch (error) {
        console.error("Failed to load episodes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEpisodes();
  }, []);

  const formatEpisodeData = (episode: AnimeEpisode): FormattedEpisode => {
    // Extrai o título base e o número do episódio
    const match = episode.title.match(
      /(.*?)(?:\s*(?:Episodio|Episódio)\s*(\d+))?$/i
    );
    const baseTitle = match ? match[1].trim() : episode.title;
    const episodeNumber = episode.episode || match?.[2] || "1";

    // Remove "Dublado" do título
    const cleanTitle = baseTitle.replace(/\s*dublado\s*/i, "").trim();

    // Generate a unique ID from title and episode number
    const uniqueId = `${slugify(cleanTitle)}-${episodeNumber}`;

    // Limpar e formatar o link corretamente
    const cleanLink = episode.link
      .replace(/^https?:\/\/[^/]+\//, "")
      .replace(/^episodio\//, "")
      .replace(/\/$/, "");

    const href = `/watch/${cleanLink}`;

    return {
      id: uniqueId,
      episodeId: episode.episode || "1",
      title: cleanTitle,
      imageUrl: episode.image,
      type: "episode",
      year: new Date().getFullYear(),
      rating: "0",
      episodeNumber,
      href,
      episodeData: {
        ...episode,
        title: cleanTitle,
        link: cleanLink,
      },
    };
  };

  const navigate = useNavigate();
  const setCurrentEpisode = useEpisodeStore((state) => state.setCurrentEpisode);

  const handleLastWatchedClick = (episode: AnimeEpisode) => {
    trackEvent({
      action: "select_content",
      category: "episode",
      label: `${episode.title} - Episode ${episode.episode}`,
    });

    setCurrentEpisode(episode);
    setTimeout(() => {
      navigate(`/watch/${episode.link}`);
    }, 0);
  };

  console.log("🚀 ~ episodes:", episodes);

  return (
    <div className="w-full">
      <div className="px-4 md:px-16 pt-20 space-y-8">
        <HeroSlider />
        <FeaturedSection />

        {/* Latest Episodes Section */}
        <section className="px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Últimos Episódios
          </h2>

          {isLoading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <ProviderStatus isLoading={isLoading} centered={false} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {episodes.map((episode) => {
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
    </div>
  );
}
