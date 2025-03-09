import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../store/features/favorites/favoritesSlice";
import { Link } from "react-router-dom";
import { useEpisodeStore } from "../../store/episodeStore";
import { AnimeEpisode } from "../../services/api";
import { generateSlug } from "../../utils/stringUtils";
import { useIMDB } from "../../hooks/useIMDB";
import { SiImdb } from "react-icons/si";

interface MediaCardProps {
  id: string;
  title: string;
  imageUrl: string;
  type: "movie" | "animes" | "episode";
  rating?: number | string;
  year?: number | string;
  episodeNumber?: string;
  quality?: string;
  href?: string;
  episodeData?: AnimeEpisode;
  onClick?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  id,
  title,
  imageUrl,
  type,
  rating,
  year,
  episodeNumber,
  href,
  episodeData,
}) => {
  const dispatch = useAppDispatch();
  const setCurrentEpisode = useEpisodeStore((state) => state.setCurrentEpisode);
  const favorites = useAppSelector((state) => state.favorites.items);
  const generatedId = generateSlug(
    title,
    String(year || new Date().getFullYear())
  );
  const isFavorite = favorites.some((item) => item.id === generatedId);

  const { imdbData, isLoading } = useIMDB(title);
  const hasValidRating = imdbData?.rating && imdbData.rating !== "N/A";

  const getWatchLink = () => {
    if (href) return href;
    if (type === "episode" && episodeData) {
      const cleanLink = episodeData.link
        .replace(/^https?:\/\/[^/]+\//, "")
        .replace(/^episodio\//, "")
        .replace(/\/$/, "");
      return `/watch/${cleanLink}`;
    }
    const cleanId = id.replace(/^anime_/, "");
    return `/anime/${cleanId}`;
  };

  const handleEpisodeClick = () => {
    if (type === "episode" && episodeData) {
      setCurrentEpisode(episodeData);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      dispatch(removeFromFavorites(generatedId));
    } else {
      dispatch(
        addToFavorites({
          id: generatedId,
          title,
          imageUrl,
          type: type === "episode" ? "animes" : type,
          rating: String(rating || "0"),
          year: String(year || new Date().getFullYear()),
        })
      );
    }
  };

  return (
    <Link
      to={getWatchLink()}
      onClick={handleEpisodeClick}
      className="group relative block rounded-lg overflow-hidden bg-zax-secondary transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100" />

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          {(isLoading || hasValidRating) && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded">
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <SiImdb className="text-[#f3ce13]" />
                  <span>...</span>
                </div>
              ) : hasValidRating ? (
                <>
                  <SiImdb className="text-[#f3ce13]" />
                  <span>{imdbData?.rating}</span>
                </>
              ) : null}
            </div>
          )}

          {rating && !hasValidRating && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded">
              <AiFillStar className="text-yellow-400" />
              <span>{rating}</span>
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white transition-colors hover:bg-zax-primary/80"
        >
          {isFavorite ? (
            <MdFavorite className="text-red-500" />
          ) : (
            <MdFavoriteBorder className="text-white" />
          )}
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-medium text-lg leading-tight mb-1 line-clamp-2">
            {title}
            {type === "episode" && episodeNumber && (
              <span className="block text-sm text-gray-300">
                Episódio {episodeNumber}
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            {year && <span>{year}</span>}
            {year && type && <span>•</span>}
            {type && <span className="capitalize">{type}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};
