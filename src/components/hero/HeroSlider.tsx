import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useTrendingAnimes } from "../../hooks/useTrendingAnimes";
import { useNavigate } from "react-router-dom";

import {
  addToFavorites,
  removeFromFavorites,
} from "../../store/features/favorites/favoritesSlice";

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const favorites = useAppSelector((state) => state.favorites.items);
  const { trending, loading } = useTrendingAnimes();

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      if (trending) {
        setCurrentIndex(
          (current) => (current + 1) % Math.min(3, trending.length)
        );
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [trending]);

  if (loading || !trending) {
    return null;
  }

  const heroItems = trending.slice(0, 3).map((anime) => ({
    id: anime.slug,
    title: anime.title,
    description: "",
    imageUrl: anime.image,
    type: anime.type,
    rating: "All",
    year: new Date().getFullYear().toString(),
  }));

  const currentItem = heroItems[currentIndex];
  const animeId = `anime_${currentItem.id}`;
  const isFavorite = favorites.some((item) => item.id === animeId);

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
      dispatch(removeFromFavorites(animeId));
    } else {
      dispatch(
        addToFavorites({
          id: animeId,
          title: currentItem.title,
          imageUrl: currentItem.imageUrl || "",
          type: "animes",
          rating: currentItem.type || "All",
          year: String(new Date().getFullYear()),
        })
      );
    }
  };

  const handlePlay = () => {
    const currentAnime = trending[currentIndex];
    if (currentAnime?.slug) {
      navigate(`/anime/${currentAnime.slug}`);
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
            src={currentItem.imageUrl || ""}
            alt={currentItem.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-2">
              {currentItem.title}
            </h1>
            <p className="text-zax-text mb-6">{currentItem.description}</p>
            <div className="flex gap-4">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 bg-zax-primary text-white px-6 py-3 rounded-lg hover:bg-zax-primary/90 transition-colors"
              >
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
        {heroItems.map((_: unknown, index: number) => (
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
