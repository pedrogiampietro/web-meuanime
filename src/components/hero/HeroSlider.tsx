import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../store/features/favorites/favoritesSlice";

const HERO_ITEMS = [
  {
    id: 1,
    title: "Jujutsu Kaisen",
    description: "T2 E1 Nova Temporada",
    imageUrl:
      "https://placehold.co/1920x1080/242a4d/7f84b5/jpeg?text=Jujutsu+Kaisen",
    type: "series",
    rating: "16+",
    year: 2023,
  },
  {
    id: 2,
    title: "Demon Slayer",
    description: "T3 E5 Novo Episódio",
    imageUrl:
      "https://placehold.co/1920x1080/242a4d/7f84b5/jpeg?text=Demon+Slayer",
    type: "series",
    rating: "16+",
    year: 2023,
  },
  {
    id: 3,
    title: "Attack on Titan",
    description: "Final Season",
    imageUrl:
      "https://placehold.co/1920x1080/242a4d/7f84b5/jpeg?text=Attack+on+Titan",
    type: "series",
    rating: "18+",
    year: 2023,
  },
] as const;

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_ITEMS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentItem = HERO_ITEMS[currentIndex];
  const isFavorite = favorites.some((item) => item.id === currentItem.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(currentItem.id));
    } else {
      dispatch(
        addToFavorites({
          ...currentItem,
          type: currentItem.type,
        })
      );
    }
  };

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={currentItem.imageUrl}
            alt={currentItem.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zax-bg via-transparent to-transparent" />
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-0 left-0 p-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              {currentItem.title}
            </h1>
            <p className="text-zax-text text-lg mb-4">
              {currentItem.description}
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-zax-primary text-white px-6 py-2 rounded-lg hover:bg-zax-primary/90 transition-colors">
                <FaPlay />
                <span>Assistir Agora</span>
              </button>
              <button
                onClick={handleToggleFavorite}
                className="flex items-center gap-2 bg-zax-secondary text-zax-text px-6 py-2 rounded-lg hover:text-white transition-colors"
              >
                {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
                <span>Minha Lista</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-6 right-8 flex gap-2">
        {HERO_ITEMS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 bg-zax-primary"
                : "bg-zax-text/50 hover:bg-zax-text"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
