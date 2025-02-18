import React, { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { addToFavorites } from "../../store/features/favorites/favoritesSlice";

// Create a simple hook for now
const useAnimeDetails = () => {
  const animeData = {
    id: "1",
    title: "Example Anime",
    image: "example.jpg",
    releaseDate: "2024",
  };
  return { id: "1", animeData };
};

const AnimeDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id, animeData } = useAnimeDetails();

  useEffect(() => {
    if (id && animeData) {
      dispatch(
        addToFavorites({
          id: String(id),
          title: animeData.title,
          imageUrl: animeData.image,
          type: "animes",
          rating: "0",
          year: String(
            animeData.releaseDate
              ? parseInt(animeData.releaseDate)
              : new Date().getFullYear()
          ),
        })
      );
    }
  }, [dispatch, id, animeData]);

  return <div>{/* Component content */}</div>;
};

export default AnimeDetails;
