import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  MdPlayArrow,
  MdPause,
  MdVolumeUp,
  MdVolumeOff,
  MdFullscreen,
  MdSettings,
} from "react-icons/md";

interface VideoSource {
  url: string;
  quality: string;
}

interface VideoPlayerProps {
  url: string;
  title: string;
  qualities: VideoSource[];
  currentQuality: string;
  onQualityChange: (quality: string) => void;
}

export function VideoPlayer({
  url,
  title,
  qualities,
  currentQuality,
  onQualityChange,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  let controlsTimeout: NodeJS.Timeout;

  useEffect(() => {
    const handleMouseMove = () => {
      setIsControlsVisible(true);
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (isPlaying) {
          setIsControlsVisible(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", () =>
        setIsControlsVisible(false)
      );
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", () =>
          setIsControlsVisible(false)
        );
      }
      clearTimeout(controlsTimeout);
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setProgress(time);
    playerRef.current?.seekTo(time);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black group"
      onDoubleClick={toggleFullScreen}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={isPlaying}
        volume={volume}
        muted={isMuted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        className="absolute top-0 left-0"
      />

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          isControlsVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Title */}
        <div className="absolute top-4 left-4">
          <h2 className="text-white text-lg font-medium">{title}</h2>
        </div>

        {/* Center Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          {isPlaying ? (
            <MdPause className="text-white text-3xl" />
          ) : (
            <MdPlayArrow className="text-white text-3xl" />
          )}
        </button>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={progress}
              onChange={handleSeek}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-sm text-white/80">
              <span>{formatTime(progress * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-zax-primary transition-colors"
              >
                {isPlaying ? (
                  <MdPause className="text-2xl" />
                ) : (
                  <MdPlayArrow className="text-2xl" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-zax-primary transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <MdVolumeOff className="text-2xl" />
                  ) : (
                    <MdVolumeUp className="text-2xl" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="text-white hover:text-zax-primary transition-colors"
                >
                  <MdSettings className="text-2xl" />
                </button>
                {isSettingsOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-zax-secondary rounded-lg shadow-lg">
                    <div className="p-2">
                      <div className="text-white text-sm font-medium mb-2">
                        Qualidade
                      </div>
                      <select
                        className="w-full bg-zax-bg text-white p-1 rounded"
                        value={currentQuality}
                        onChange={(e) => onQualityChange(e.target.value)}
                      >
                        {qualities.map((source) => (
                          <option key={source.quality} value={source.quality}>
                            {source.quality}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

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
    </div>
  );
}
