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
import { useAnalytics } from "../hooks/useAnalytics";
import { useIMDB } from "../hooks/useIMDB";
import { SiImdb } from "react-icons/si";
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import { BsCollectionPlayFill } from "react-icons/bs";

export function AnimeDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [anime, setAnime] = useState<AnimeDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const animeId = `anime_${slug}`;
  const isFavorite = favorites.some((item) => item.id === animeId);
  const navigate = useNavigate();
  const setCurrentEpisode = useEpisodeStore((state) => state.setCurrentEpisode);
  const { trackPageView, trackEvent } = useAnalytics();
  const { imdbData } = useIMDB(anime?.title);

  const formatEpisodeLink = (link: string): string => {
    return link
      .replace(/^https?:\/\/[^/]+\//, "") // Remove o domínio
      .replace(/^episodio\//, "") // Remove o prefixo 'episodio/'
      .replace(/\/$/, ""); // Remove a barra final se existir
  };

  const handleEpisodeClick = (episode: {
    number: string;
    title?: string;
    playerUrl: string;
    link: string;
  }) => {
    const cleanLink = formatEpisodeLink(episode.link);

    console.log("🎬 Clicou no episódio:", {
      episode,
      cleanLink,
      animeTitle: anime?.title,
      animeType: anime?.type,
    });

    trackEvent({
      action: "select_content",
      category: "episode",
      label: `${anime?.title} - Episode ${episode.number}`,
    });

    const episodeData = {
      title: anime?.title || "",
      episode: episode.number,
      playerUrl: episode.playerUrl,
      quality: anime?.type || "",
      image: anime?.image,
      link: cleanLink,
      provider: "goyabu" as const,
    };

    console.log("📦 Dados do episódio sendo salvos:", episodeData);

    setCurrentEpisode(episodeData);

    console.log("🔄 Redirecionando para:", `/watch/${cleanLink}`);

    setTimeout(() => {
      navigate(`/watch/${cleanLink}`);
    }, 0);
  };

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

  useEffect(() => {
    if (anime) {
      trackPageView(`/anime/${slug}`);
      trackEvent({
        action: "view_item",
        category: "anime",
        label: anime.title,
      });
    }
  }, [anime, slug]);

  const handleFavoriteClick = () => {
    if (!anime || !slug) return;

    trackEvent({
      action: isFavorite ? "remove_from_favorites" : "add_to_favorites",
      category: "engagement",
      label: anime.title,
    });

    if (isFavorite) {
      dispatch(removeFromFavorites(String(anime.id)));
    } else {
      dispatch(
        addToFavorites({
          id: String(anime.id),
          title: anime.title,
          imageUrl: anime.image,
          type: "animes",
          rating: imdbData?.rating || "0",
          year: String(anime.year),
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zax-bg">
        <div className="w-8 h-8 border-4 border-zax-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zax-bg">
        <div className="text-center">
          <h1 className="text-2xl text-zax-text mb-4">
            {error || "Anime não encontrado"}
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-zax-primary text-white rounded-lg hover:bg-zax-primary/80 transition-colors"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zax-bg">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={anime.image}
            alt={anime.title}
            className="w-full h-full object-cover filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zax-bg via-zax-bg/90 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="w-64 flex-shrink-0">
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">{anime.title}</h1>
                <button
                  onClick={handleFavoriteClick}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isFavorite ? (
                    <MdFavorite className="w-6 h-6 text-red-500" />
                  ) : (
                    <MdFavoriteBorder className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-6 mb-6 text-white/80">
                {imdbData?.rating && (
                  <div className="flex items-center gap-2">
                    <SiImdb className="text-[#f3ce13] text-2xl" />
                    <span className="font-semibold">{imdbData.rating}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <IoCalendarOutline className="text-xl" />
                  <span>{anime.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BsCollectionPlayFill className="text-xl" />
                  <span>{anime.episodes.length} Episódios</span>
                </div>
                <div className="flex items-center gap-2">
                  <IoTimeOutline className="text-xl" />
                  <span>{anime.type}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-white/80 text-lg leading-relaxed max-w-3xl">
                {anime.synopsis}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <BsCollectionPlayFill className="text-purple-500" />
          Episódios
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {anime.episodes.map((episode) => (
            <button
              key={episode.number}
              onClick={() => handleEpisodeClick(episode)}
              className="group bg-zax-bg-light rounded-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
            >
              <div className="aspect-video relative">
                <img
                  src={anime.image}
                  alt={`Episódio ${episode.number}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:via-black/40 transition-all duration-300">
                  <div className="absolute top-3 left-3">
                    <span className="bg-purple-500 text-white px-2.5 py-1 rounded-md text-sm font-medium">
                      EP {episode.number}
                    </span>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-2">
                  <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors line-clamp-1">
                    Episódio {episode.number}
                  </h3>
                  {episode.title && (
                    <p className="text-zax-text/70 text-sm line-clamp-2 h-10">
                      {episode.title}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-zax-text/60">
                    <span className="flex items-center gap-1">
                      <BsCollectionPlayFill />
                      {anime.type}
                    </span>
                    <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full">
                      HD
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
