import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useQuery } from "@tanstack/react-query";
import { animeApi } from "../../services/api";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../store/features/favorites/favoritesSlice";

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const { data: trending, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => animeApi.getTrending(),
  });

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      if (trending?.results) {
        setCurrentIndex(
          (current) => (current + 1) % Math.min(3, trending.results.length)
        );
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [trending?.results]);

  if (isLoading || !trending) {
    return null;
  }

  const heroItems = trending.results.slice(0, 3).map((anime) => ({
    id: anime.id,
    title: anime.title,
    description: anime.genres?.join(", ") || "",
    imageUrl: anime.image,
    type: "series",
    rating: "All",
    year: parseInt(anime.releaseDate) || new Date().getFullYear(),
  }));

  const currentItem = heroItems[currentIndex];
  const isFavorite = favorites.some((item) => item.id === currentItem.id);

  const handlePrevious = () => {
    setCurrentIndex(
      (current) => (current - 1 + heroItems.length) % heroItems.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % heroItems.length);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(currentItem.id));
    } else {
      dispatch(addToFavorites(currentItem));
    }
  };

  return (
    <div className="relative h-[600px] overflow-hidden group">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zax-bg via-transparent to-transparent" />
          <img
            src={currentItem.imageUrl}
            alt={currentItem.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-2">
              {currentItem.title}
            </h1>
            <p className="text-zax-text mb-6">{currentItem.description}</p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-zax-primary text-white px-6 py-3 rounded-lg hover:bg-zax-primary/90 transition-colors">
                <FaPlay />
                <span>Assistir</span>
              </button>
              <button
                onClick={handleToggleFavorite}
                className="flex items-center justify-center w-12 h-12 bg-zax-button text-white rounded-lg hover:bg-zax-primary transition-colors"
              >
                {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <IoIosArrowBack size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <IoIosArrowForward size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-zax-primary w-4"
                : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
