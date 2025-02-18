import { MediaCard } from "../components/cards/MediaCard";
import { useAnimes } from "../hooks/useAnimes";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ProviderStatus } from "../components/ProviderStatus";
import { slugify } from "../utils/slugify";

export function Animes() {
  const { animes, loading, error, page, setPage } = useAnimes();

  const createUniqueId = (anime: (typeof animes)[0]) => {
    return slugify(anime.title);
  };

  // const transformedResults = providerResults.map((result) => ({
  //   ...result,
  //   data: result.data?.animes || null,
  // }));

  if (loading) {
    return (
      <div className="p-8 pt-24 text-white">
        <div className="max-w-[1920px] mx-auto">
          <h1 className="text-4xl font-bold mb-12">Animes</h1>
          <ProviderStatus isLoading={loading} centered={false} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 pt-24 text-white">
        <h1>Erro ao carregar animes: {error}</h1>
      </div>
    );
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div className="p-8 pt-24">
      <div className="max-w-[1920px] mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Animes</h1>

        {/* Lista de Animes */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {animes.map((anime) => (
              <MediaCard
                key={anime.slug}
                id={createUniqueId(anime)}
                title={anime.title}
                imageUrl={anime.image}
                type="animes"
                rating="0"
                year={String(new Date().getFullYear())}
              />
            ))}
          </div>
        </section>

        {/* Paginação */}
        <div className="flex items-center justify-center gap-4 mt-8 mb-16">
          <button
            onClick={handlePreviousPage}
            disabled={page <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-zax-button rounded-lg text-white hover:bg-zax-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosArrowBack />
            Anterior
          </button>

          <span className="text-white">Página {page}</span>

          <button
            onClick={handleNextPage}
            className="flex items-center gap-2 px-4 py-2 bg-zax-button rounded-lg text-white hover:bg-zax-primary transition-colors"
          >
            Próxima
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
}
