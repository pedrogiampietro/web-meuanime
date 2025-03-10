import ReactPlayer from "react-player";
import { useState, useEffect } from "react";
import { MdPlayArrow, MdPause, MdFullscreen, MdSettings } from "react-icons/md";
import { useWatchHistory } from "../../hooks/useWatchHistory";
import { useStore } from "../../store/useStore";
import { toast } from "react-hot-toast";

interface VideoPlayerProps {
  url: string;
  title: string;
  animeId: string;
  episodeNumber: number;
}

export function VideoPlayer({
  url,
  title,
  animeId,
  episodeNumber,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasStartedWatching, setHasStartedWatching] = useState(false);
  const { updateWatchHistory, isFullyAuthenticated } = useWatchHistory();
  const { user } = useStore();

  // Registra quando o usuário começa a assistir
  useEffect(() => {
    const saveProgress = async () => {
      if (!isFullyAuthenticated || !user?.id) {
        if (isPlaying) {
          toast.error("Faça login para salvar seu progresso de visualização");
          setIsPlaying(false);
        }
        return;
      }

      if (isPlaying && !hasStartedWatching) {
        setHasStartedWatching(true);

        // Verifica se temos todas as informações necessárias
        if (!animeId) {
          console.error("❌ Missing animeId");
          toast.error("Erro ao salvar progresso: ID do anime não encontrado");
          return;
        }

        if (!episodeNumber) {
          console.error("❌ Missing episodeNumber");
          toast.error(
            "Erro ao salvar progresso: Número do episódio não encontrado"
          );
          return;
        }

        console.log("🎬 Iniciando registro de visualização:", {
          animeId,
          episodeNumber,
          userId: user.id,
        });

        try {
          await updateWatchHistory({
            user_id: user.id,
            anime_id: animeId,
            episode_number: episodeNumber,
            progress_percentage: 0,
            watched_at: new Date().toISOString(),
          });
          console.log("✅ Progresso salvo com sucesso!");
          toast.success("Progresso salvo com sucesso!");
        } catch (error) {
          console.error("❌ Erro ao salvar progresso:", error);
          toast.error(
            "Erro ao salvar seu progresso. Por favor, tente novamente."
          );
        }
      }
    };

    saveProgress();
  }, [
    isPlaying,
    hasStartedWatching,
    isFullyAuthenticated,
    user?.id,
    animeId,
    episodeNumber,
  ]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullScreen = () => {
    const player = document.querySelector(".player-wrapper");
    if (player) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        player.requestFullscreen();
      }
    }
  };

  return (
    <div className="player-wrapper relative bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        playing={isPlaying}
        controls={false}
        className="react-player"
        config={{
          file: {
            forceVideo: true,
            attributes: {
              crossOrigin: "anonymous",
            },
            hlsOptions: {
              xhrSetup: function () {
                // Remova esta linha que força credentials
                // xhr.withCredentials = true;
              },
            },
          },
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(error) => {
          console.error("❌ Erro no player:", error);
          toast.error(
            "Erro ao reproduzir o vídeo. Por favor, tente novamente."
          );
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-zax-primary transition-colors"
            >
              {isPlaying ? (
                <MdPause className="text-2xl" />
              ) : (
                <MdPlayArrow className="text-2xl" />
              )}
            </button>
            <span className="text-white text-sm">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="text-white hover:text-zax-primary transition-colors"
            >
              <MdSettings className="text-2xl" />
            </button>
            <button
              onClick={toggleFullScreen}
              className="text-white hover:text-zax-primary transition-colors"
            >
              <MdFullscreen className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
