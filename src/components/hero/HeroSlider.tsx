import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useTrendingAnimes } from "../../hooks/useTrendingAnimes";
import { useNavigate } from "react-router-dom";
import { generateSlug } from "../../utils/stringUtils";

import {
  addToFavorites,
  removeFromFavorites,
} from "../../store/features/favorites/favoritesSlice";

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const favorites = useAppSelector((state) => state.favorites.items);
  const { trending, loading } = useTrendingAnimes();

  useEffect(() => {
    setIsImageLoaded(false);
  }, [currentIndex]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      if (trending) {
        setCurrentIndex(
          (current) => (current + 1) % Math.min(3, trending.length)
        );
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [trending]);

  if (loading || !trending || trending.length === 0) {
    return null;
  }

  const heroItems = trending.slice(0, 3).map((anime) => ({
    id: anime.slug,
    title: anime.title,
    description: "Assista agora este incrível anime!",
    imageUrl: anime.image,
    type: anime.type,
    rating: "All",
    year: new Date().getFullYear().toString(),
  }));

  const currentItem = heroItems[currentIndex];
  if (!currentItem) return null;

  const generatedId = generateSlug(currentItem.title, currentItem.year);
  const isFavorite = favorites.some((item) => item.id === generatedId);

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
      dispatch(removeFromFavorites(generatedId));
    } else {
      dispatch(
        addToFavorites({
          id: generatedId,
          title: currentItem.title,
          imageUrl: currentItem.imageUrl || "",
          type: "animes",
          rating: currentItem.type || "All",
          year: currentItem.year,
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
    <div className="relative h-[70vh] min-h-[600px] max-h-[800px] overflow-hidden group mt-16">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.7, ease: "easeOut" },
          }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="absolute inset-0"
        >
          {/* Overlay gradients for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-zax-bg via-zax-bg/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zax-bg/90 via-transparent to-transparent" />

          {/* Main hero image */}
          <div className="relative h-full">
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-full object-cover transform scale-105 transition-transform duration-10000 ease-out ${
                isImageLoaded ? "scale-100" : "scale-105"
              }`}
              style={{ objectPosition: "center 20%" }}
            />
          </div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-0 left-0 p-8 max-w-2xl"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-5xl font-bold text-white mb-2 leading-tight"
              >
                {currentItem.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-lg text-gray-200 mb-6 line-clamp-2"
              >
                {currentItem.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex gap-4"
              >
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <FaPlay className="text-lg" />
                  <span className="font-semibold">Assistir</span>
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className="flex items-center justify-center w-14 h-14 bg-purple-600/20 hover:bg-purple-600/30 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isFavorite ? (
                    <MdFavorite className="text-2xl text-purple-500" />
                  ) : (
                    <MdFavoriteBorder className="text-2xl" />
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={handlePrevious}
          className="pointer-events-auto p-2 rounded-full bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-600/50 transform hover:scale-110"
        >
          <IoIosArrowBack size={28} />
        </button>
        <button
          onClick={handleNext}
          className="pointer-events-auto p-2 rounded-full bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-600/50 transform hover:scale-110"
        >
          <IoIosArrowForward size={28} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 right-8 flex gap-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-purple-500"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
