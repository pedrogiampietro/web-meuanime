import { FaPlay } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../store/features/favorites/favoritesSlice";
import { MediaContent } from "../../types/media";

interface MediaCardProps extends MediaContent {}

export function MediaCard(props: MediaCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === props.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(props.id));
    } else {
      dispatch(addToFavorites(props));
    }
  };

  return (
    <div className="group relative rounded-lg overflow-hidden">
      <img
        src={props.imageUrl}
        alt={props.title}
        className="w-full aspect-[16/9] object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-white font-medium mb-1">{props.title}</h3>
          <div className="flex items-center gap-2 text-sm text-zax-text mb-3">
            {props.rating && <span>{props.rating}</span>}
            {props.year && <span>•</span>}
            {props.year && <span>{props.year}</span>}
            <span>•</span>
            <span className="capitalize">{props.type}</span>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-zax-primary text-white px-4 py-2 rounded-lg hover:bg-zax-primary/90 transition-colors">
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
    </div>
  );
}
