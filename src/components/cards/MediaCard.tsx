import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../store/features/favorites/favoritesSlice";
import { Link } from "react-router-dom";
import { useEpisodeStore } from "../../store/episodeStore";
import { AnimeEpisode } from "../../services/api";

import { generateSlug } from "../../utils/stringUtils";

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
    <div className="group relative rounded-lg overflow-hidden">
      <Link to={getWatchLink()} onClick={handleEpisodeClick} className="block">
        <div className="relative aspect-video">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 p-4 w-full">
              <h3 className="text-white font-medium mb-1">
                {title} {type === "episode" && `- Episódio ${episodeNumber}`}
              </h3>
              <div className="flex items-center gap-2 text-sm text-zax-text">
                {rating && <span>{rating}</span>}
                {year && <span>•</span>}
                {year && <span>{year}</span>}
                <span>•</span>
                <span className="capitalize">{type}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zax-primary"
      >
        {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
      </button>
    </div>
  );
};
