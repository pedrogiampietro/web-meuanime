import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MdFavorite, MdFavoriteBorder, MdPlayArrow } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addToFavorites,
  removeFromFavorites,
} from "../store/features/favorites/favoritesSlice";

interface AnimeDetailsState {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  coverImage: string;
  genres: string[];
  type: string;
  status: string;
  releaseDate: string;
  rating: string;
  episodes: {
    id: string;
    number: string;
    title: string;
    thumbnail: string;
  }[];
  duration: string;
  year?: number;
  synopsis?: string;
}

export const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [animeData, setAnimeData] = useState<AnimeDetailsState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => Number(item.id) === Number(id));

  useEffect(() => {
    async function loadAnimeDetails() {
      if (!id) return;

      try {
        setIsLoading(true);
        const details = {} as any;
        // const details = await animeApi.getAnimeDetails(id);
        // Transform the API response to match AnimeDetailsState
        setAnimeData({
          id: details.id,
          slug: details.url.split("/").pop() || "",
          title: details.title,
          description: details.description,
          image: details.image,
          coverImage: details.image,
          genres: details.genres || [],
          type: details.type,
          status: details.status || "Unknown",
          releaseDate: details.releaseDate,
          rating: "N/A", // Default rating
          episodes: details.episodes.map((ep) => ({
            id: ep.id,
            number: String(ep.number),
            title: `Episode ${ep.number}`, // Default title
            thumbnail: details.image, // Use anime image as fallback
          })),
          duration: "Unknown",
        });
      } catch (err) {
        setError("Erro ao carregar detalhes do anime");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnimeDetails();
  }, [id]);

  useEffect(() => {
    if (id && animeData) {
      dispatch(
        addToFavorites({
          id: Number(id),
          title: animeData.title,
          imageUrl: animeData.image,
          type: "series",
          rating: "0",
          year: animeData.releaseDate
            ? parseInt(animeData.releaseDate)
            : new Date().getFullYear(), // This will never be undefined
        })
      );
    }
  }, [dispatch, id, animeData]);

  const handleFavoriteClick = () => {
    if (!animeData || !id) return;

    if (isFavorite) {
      dispatch(removeFromFavorites(Number(id)));
    } else {
      dispatch(
        addToFavorites({
          id: Number(id),
          title: animeData.title,
          imageUrl: animeData.image,
          type: "series",
          rating: animeData.rating,
          year: animeData.releaseDate
            ? parseInt(animeData.releaseDate)
            : new Date().getFullYear(), // Provide default value
        })
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zax-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !animeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zax-text mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-white hover:text-zax-primary transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zax-bg">
      {/* Hero Section */}
      <div className="relative h-[500px]">
        <div className="absolute inset-0">
          <img
            src={animeData.coverImage}
            alt={animeData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zax-bg via-zax-bg/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 p-8 max-w-3xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            {animeData.title}
          </h1>
          <div className="flex items-center gap-4 text-zax-text mb-4">
            <span>{animeData.year}</span>
            <span>•</span>
            <span>{animeData.type}</span>
            <span>•</span>
            <span>{animeData.status}</span>
          </div>
          <p className="text-zax-text mb-6">{animeData.synopsis}</p>
          <div className="flex items-center gap-4">
            <Link
              to={`/watch/${id}/1`}
              className="flex items-center gap-2 bg-zax-primary text-white px-6 py-3 rounded-lg hover:bg-zax-primary/90 transition-colors"
            >
              <MdPlayArrow className="text-2xl" />
              <span>Assistir Agora</span>
            </Link>
            <button
              onClick={handleFavoriteClick}
              className="flex items-center gap-2 bg-zax-button text-white px-6 py-3 rounded-lg hover:bg-zax-primary transition-colors"
            >
              {isFavorite ? (
                <MdFavorite className="text-2xl" />
              ) : (
                <MdFavoriteBorder className="text-2xl" />
              )}
              <span>
                {isFavorite
                  ? "Remover dos Favoritos"
                  : "Adicionar aos Favoritos"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Episódios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {animeData.episodes.map((episode) => (
            <Link
              key={episode.number}
              to={`/watch/${animeData.slug}-episode-${episode.number}`}
              className="bg-zax-secondary rounded-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <div className="aspect-video bg-zax-button relative">
                {episode.thumbnail ? (
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MdPlayArrow className="text-4xl text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium">
                  Episódio {episode.number}
                </h3>
                <p className="text-sm text-zax-text">{episode.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
