import { MediaCard } from "../components/cards/MediaCard";
import { useAppSelector } from "../store/hooks";

export function Favorites() {
  const favorites = useAppSelector((state) => state.favorites.items);

  return (
    <div className="p-8 pt-12">
      <div className="max-w-[1920px] mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Meus Favoritos</h1>

        {favorites.length === 0 ? (
          <div className="text-center text-zax-text py-12">
            <p className="text-lg">Você ainda não adicionou nenhum favorito.</p>
            <p className="mt-2">
              Clique no ícone de coração nos títulos para adicioná-los aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <MediaCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
