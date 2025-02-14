import { Navigate } from "react-router-dom";
import { useEpisodeStore } from "../store/episodeStore";
import { VideoPlayer } from "../components/player/VideoPlayer";

export function Watch() {
  const currentEpisode = useEpisodeStore((state) => state.currentEpisode);

  if (!currentEpisode) {
    console.log("Redirecting to home - no episode data");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="bg-zax-card rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          {currentEpisode.title}
          {currentEpisode.episode && ` - Episódio ${currentEpisode.episode}`}
        </h1>

        <div className="aspect-video bg-black rounded-lg mb-4">
          {currentEpisode.playerUrl && (
            <VideoPlayer
              url={currentEpisode.playerUrl}
              title={currentEpisode.title}
            />
          )}
        </div>

        <div className="text-zax-text mt-4">
          {currentEpisode.quality && (
            <span className="bg-zax-primary px-2 py-1 rounded">
              {currentEpisode.quality}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
