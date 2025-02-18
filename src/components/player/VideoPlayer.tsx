import ReactPlayer from "react-player";
import { useState } from "react";
import { MdPlayArrow, MdPause, MdFullscreen, MdSettings } from "react-icons/md";

interface VideoPlayerProps {
  url: string;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
