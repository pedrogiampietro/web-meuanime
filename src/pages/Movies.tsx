import { MediaCard } from "../components/cards/MediaCard";
import { ANIME_CONTENT } from "../mocks/content";

export function Movies() {
  return (
    <div className="p-8 pt-12">
      <div className="max-w-[1920px] mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Filmes</h1>

        {/* Últimos Lançamentos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            Últimos Lançamentos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ANIME_CONTENT.movies.slice(0, 4).map((movie) => (
              <MediaCard key={movie.id} {...movie} />
            ))}
          </div>
        </section>

        {/* Clássicos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Clássicos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ANIME_CONTENT.movies.slice(4).map((movie) => (
              <MediaCard key={movie.id} {...movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
