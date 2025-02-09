import { MediaCard } from "../cards/MediaCard";
import { useQuery } from "@tanstack/react-query";
import { animeApi } from "../../services/api";

export function FeaturedSection() {
  const {
    data: trending,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: () => animeApi.getTrending(),
  });

  if (isLoading) {
    return (
      <section className="px-8 py-6">
        <h2 className="text-2xl font-bold text-white mb-6">Em Destaque</h2>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-zax-primary border-t-transparent"></div>
        </div>
      </section>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <section className="px-8 py-6">
      <h2 className="text-2xl font-bold text-white mb-6">Em Destaque</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trending?.results.slice(0, 4).map((anime) => (
          <MediaCard
            key={anime.id}
            id={anime.id}
            title={anime.title}
            imageUrl={anime.image}
            type="series"
            rating="All"
            year={parseInt(anime.releaseDate) || new Date().getFullYear()}
          />
        ))}
      </div>
    </section>
  );
}
