import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEpisodeStore } from "../store/episodeStore";
import {
  addToFavorites,
  removeFromFavorites,
} from "../store/features/favorites/favoritesSlice";
import { api } from "../services/api";
import { AnimeDetails as AnimeDetailsType } from "../types/anime";

export function AnimeDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [anime, setAnime] = useState<AnimeDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === Number(slug));
  const navigate = useNavigate();
  const setCurrentEpisode = useEpisodeStore((state) => state.setCurrentEpisode);

  useEffect(() => {
    async function loadAnimeDetails() {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await api.getAnimeDetails(slug);
        setAnime(response);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar detalhes do anime");
      } finally {
        setLoading(false);
      }
    }

    loadAnimeDetails();
  }, [slug]);

  const handleFavoriteClick = () => {
    if (!anime || !slug) return;

    if (isFavorite) {
      dispatch(removeFromFavorites(Number(slug)));
    } else {
      dispatch(
        addToFavorites({
          id: Number(slug),
          title: anime.title,
          imageUrl: anime.image,
          type: "animes",
          rating: "0",
          year: String(anime.year),
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zax-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-zax-text mb-4">
            {error || "Anime não encontrado"}
          </h1>
          <a
            href="/"
            className="text-zax-primary hover:text-zax-primary/80 transition-colors"
          >
            Voltar para Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-zax-bg-light rounded-lg overflow-hidden shadow-lg">
        {/* Banner com Gradiente */}
        <div className="relative h-[400px]">
          <img
            src={anime.image}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zax-bg via-zax-bg/50 to-transparent" />

          {/* Informações sobre o Banner */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-white">{anime.title}</h1>
              <button
                onClick={handleFavoriteClick}
                className="p-2 rounded-full bg-zax-bg/50 hover:bg-zax-primary/50 transition-colors"
              >
                {isFavorite ? (
                  <MdFavorite className="w-6 h-6 text-red-500" />
                ) : (
                  <MdFavoriteBorder className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80">
              <div>
                <span className="text-white/60">Ano:</span> {anime.year}
              </div>
              <div>
                <span className="text-white/60">Tipo:</span> {anime.type}
              </div>
              <div>
                <span className="text-white/60">Status:</span> {anime.status}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <p className="text-zax-text/80 mb-8 text-lg leading-relaxed">
            {anime.synopsis}
          </p>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Episódios</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.episodes.map((episode) => (
                <a
                  key={episode.number}
                  href={`/watch/${episode.link}`}
                  className="group"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentEpisode({
                      title: anime.title,
                      episode: episode.number,
                      playerUrl: episode.playerUrl,
                      quality: anime.type,
                    });
                    navigate(`/watch/${episode.link}`);
                  }}
                >
                  <div className="aspect-video bg-zax-bg rounded-lg overflow-hidden relative">
                    <img
                      src={anime.image}
                      alt={episode.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 p-3 w-full">
                        <span className="text-white text-sm font-medium">
                          {episode.title || `${episode.number}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
