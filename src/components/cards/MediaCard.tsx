import { FaPlay } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

interface MediaCardProps {
  title: string;
  imageUrl: string;
  type: "movie" | "series";
  rating?: string;
  year?: number;
}

export function MediaCard({
  title,
  imageUrl,
  type,
  rating,
  year,
}: MediaCardProps) {
  return (
    <div className="group relative rounded-lg overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full aspect-[16/9] object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-white font-medium mb-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-zax-text mb-3">
            {rating && <span>{rating}</span>}
            {year && <span>•</span>}
            {year && <span>{year}</span>}
            <span>•</span>
            <span className="capitalize">{type}</span>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-zax-primary text-white px-4 py-2 rounded-lg hover:bg-zax-primary/90 transition-colors">
              <FaPlay />
              <span>Assistir</span>
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-zax-button text-white rounded-lg hover:bg-zax-primary transition-colors">
              <MdFavorite />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
