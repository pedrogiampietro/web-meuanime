import { FeaturedSection } from "../components/sections/FeaturedSection";
import { HeroSlider } from "../components/hero/HeroSlider";
import { animeApi } from "../services/api";
import { MediaCard } from "../components/cards/MediaCard";
import { useQuery } from "@tanstack/react-query";
import { Recent } from "../types/consumet";

export function Home() {
  const {
    data: recentEpisodes,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["recentEpisodes"],
    queryFn: () => animeApi.getRecentEpisodes(),
  });

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
            {recentEpisodes?.results.map((episode: Recent) => (
              <MediaCard
                key={episode.id}
                id={Number(episode.id)}
                episodeId={episode.episodeId}
                title={`${episode.title} - Episódio ${episode.episodeNumber}`}
                imageUrl={episode.image}
                type="episode"
                year={new Date().getFullYear()}
                rating="0"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
