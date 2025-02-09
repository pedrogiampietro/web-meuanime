import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { VideoPlayer } from "../components/player/VideoPlayer";
import { animeApi } from "../services/api";
import { Link } from "react-router-dom";

export function WatchAnime() {
  const { episodeId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [videoSources, setVideoSources] = useState<Watch | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!episodeId) return;

      try {
        const data = await animeApi.getEpisodeSources(episodeId);
        setVideoSources(data);
      } catch (error) {
        console.error("Error fetching episode:", error);
        setError("Erro ao carregar o episódio");
      }
    }

    fetchData();
  }, [episodeId]);

  const currentSource = videoSources?.sources.find(
    (source) => source.quality === selectedQuality
  );

  return (
    <div className="min-h-screen bg-zax-bg p-8">
      <Link to="/" className="flex items-center gap-2 text-white mb-6">
        <MdArrowBack />
        <span>Voltar</span>
      </Link>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-zax-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center text-zax-text py-12">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-white hover:text-zax-primary transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <VideoPlayer
          url={currentSource?.url || ""}
          title={episodeId || ""}
          qualities={videoSources?.sources || []}
          currentQuality={selectedQuality}
          onQualityChange={setSelectedQuality}
        />
      )}
    </div>
  );
}
