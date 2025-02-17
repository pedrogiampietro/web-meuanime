import { MediaCard } from "../cards/MediaCard";
import { useQuery } from "@tanstack/react-query";

interface FeaturedAnime {
  id: number;
  title: string;
  image: string;
  rating: string;
  year: number;
}

export function FeaturedSection() {
  const { data: featuredAnimes } = useQuery<FeaturedAnime[]>({
    queryKey: ["featuredAnimes"],
    queryFn: () => Promise.resolve([]),
  });

  if (!featuredAnimes?.length) {
    return null;
  }

  return (
    <section className="px-8 py-6">
      <h2 className="text-2xl font-bold text-white mb-6">Destaques</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredAnimes.map((anime) => (
          <MediaCard
            key={anime.id}
            id={anime.id}
            title={anime.title}
            imageUrl={anime.image}
            type="animes"
            rating={anime.rating}
            year={anime.year}
          />
        ))}
      </div>
    </section>
  );
}
