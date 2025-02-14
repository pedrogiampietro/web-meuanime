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
  quality,
  href,
  episodeData,
  onClick,
}) => {
  const dispatch = useAppDispatch();
  const setCurrentEpisode = useEpisodeStore((state) => state.setCurrentEpisode);
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === id);

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
