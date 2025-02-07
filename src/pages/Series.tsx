import { MediaCard } from "../components/cards/MediaCard";
import { ANIME_CONTENT } from "../mocks/content";

export function Series() {
  return (
    <div className="p-8 pt-12">
      <div className="max-w-[1920px] mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Séries</h1>

        {/* Lançamentos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Lançamentos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ANIME_CONTENT.series.slice(0, 4).map((series) => (
              <MediaCard key={series.id} {...series} />
            ))}
          </div>
        </section>

        {/* Populares */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ANIME_CONTENT.series.slice(4, 8).map((series) => (
              <MediaCard key={series.id} {...series} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
