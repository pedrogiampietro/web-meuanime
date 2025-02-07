import { MediaCard } from "../cards/MediaCard";
import { ANIME_CONTENT } from "../../mocks/content";

export function FeaturedSection() {
  return (
    <section className="px-8 py-6">
      <h2 className="text-2xl font-bold text-white mb-6">Em Destaque</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ANIME_CONTENT.featured.map((item) => (
          <MediaCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
