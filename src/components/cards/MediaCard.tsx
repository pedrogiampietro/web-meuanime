import { FaPlay } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../store/features/favorites/favoritesSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEpisodeStore } from "../../store/episodeStore";
import { AnimeEpisode } from "../../services/api";
import { useState } from "react";

interface MediaCardProps {
  id: number;
  title: string;
  imageUrl: string;
  type: "movie" | "series" | "episode";
  rating?: number | string;
  year?: number;
  episodeNumber?: string;
  quality?: string;
  href?: string;
  episodeData?: AnimeEpisode;
}

export function MediaCard({
  id,
  title,
  imageUrl,
  type,
  rating,
  year,
  episodeNumber,
  quality,
  href,
  episodeData,
}: MediaCardProps) {
  const dispatch = useAppDispatch();
  const setCurrentEpisode = useEpisodeStore((state) => state.setCurrentEpisode);
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === id);
  const [isHovered, setIsHovered] = useState(false);

  const getWatchLink = () => {
    if (href) return href;
    if (type === "episode" && episodeData) {
      const cleanLink = episodeData.link
        .replace(/^https?:\/\/[^/]+\//, "")
        .replace(/^episodio\//, "")
        .replace(/\/$/, "");
      return `/watch/${cleanLink}`;
    }
    return `/anime/${id}`;
  };

  const handleEpisodeClick = (e: React.MouseEvent) => {
    if (type === "episode" && episodeData) {
      setCurrentEpisode(episodeData);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(
        addToFavorites({
          id,
          title,
          imageUrl,
          type: type === "episode" ? "series" : type,
          rating: String(rating || "0"),
          year: year || new Date().getFullYear(),
        })
      );
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="group relative rounded-lg overflow-hidden">
      <Link to={getWatchLink()} onClick={handleEpisodeClick} className="block">
        <img
          src={imageUrl}
          alt={title}
          className="w-full aspect-[16/9] object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 p-4 w-full">
            <h3 className="text-white font-medium mb-1">
              {title} {type === "episode" && `- Episódio ${episodeNumber}`}
            </h3>
            <div className="flex items-center gap-2 text-sm text-zax-text mb-3">
              {rating && <span>{rating}</span>}
              {year && <span>•</span>}
              {year && <span>{year}</span>}
              <span>•</span>
              <span className="capitalize">{type}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleEpisodeClick}
                className="flex items-center gap-2 bg-zax-primary text-white px-4 py-2 rounded-lg hover:bg-zax-primary/90 transition-colors"
              >
                <FaPlay />
                <span>Assistir</span>
              </button>
              <button
                onClick={handleToggleFavorite}
                className="flex items-center justify-center w-10 h-10 bg-zax-button text-white rounded-lg hover:bg-zax-primary transition-colors"
              >
                {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
