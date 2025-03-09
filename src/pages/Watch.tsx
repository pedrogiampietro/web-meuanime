import { Navigate } from "react-router-dom";
import { useEpisodeStore } from "../store/episodeStore";
import { VideoPlayer } from "../components/player/VideoPlayer";
import { useAnalytics } from "../hooks/useAnalytics";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { IoTimeOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { SiImdb } from "react-icons/si";
import { BsInfoCircle, BsListUl, BsPeople, BsPerson } from "react-icons/bs";

interface IMDBData {
  title: string;
  year: string;
  rating: string;
  duration: string;
  genres: string[];
  plot: string;
  poster: string;
  actors?: string[];
  released?: string;
  totalSeasons?: string;
  type?: string;
  imdbVotes?: string;
}

interface SectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  isOpen,
  onToggle,
  icon,
  children,
}) => (
  <div className="bg-[#1a1d29] rounded-lg overflow-hidden h-full">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full p-4 text-white hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xl font-semibold">{title}</span>
      </div>
      {isOpen ? (
        <MdKeyboardArrowUp size={24} />
      ) : (
        <MdKeyboardArrowDown size={24} />
      )}
    </button>
    {isOpen && <div className="p-4 pt-0">{children}</div>}
  </div>
);

export function Watch() {
  const { trackPageView, trackEvent } = useAnalytics();
  const currentEpisode = useEpisodeStore((state) => state.currentEpisode);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [imdbData, setImdbData] = useState<IMDBData | null>(null);

  useEffect(() => {
    if (currentEpisode) {
      trackPageView(`/watch/${currentEpisode.playerUrl}`);
      trackEvent({
        action: "play_video",
        category: "content",
        label: `${currentEpisode.title} - Episode ${currentEpisode.episode}`,
      });

      fetchIMDBData(currentEpisode.title);
    }
  }, [currentEpisode]);

  const formatImdbData = (data: any): IMDBData => {
    // Função auxiliar para tratar valores N/A
    const formatValue = (value: string): string | undefined =>
      value === "N/A" ? undefined : value;

    // Formata o ano removendo o traço do final (2025– -> 2025)
    const formatYear = (year: string) => year?.replace("–", "").trim();

    // Formata atores em array e remove vazios
    const formatActors = (actors: string) =>
      formatValue(actors)
        ?.split(",")
        .map((a) => a.trim())
        .filter(Boolean) || [];

    return {
      title: data.Title,
      year: formatYear(data.Year),
      rating: formatValue(data.imdbRating) || "N/A",
      duration: formatValue(data.Runtime) || "N/A",
      genres: data.Genre.split(", "),
      plot: data.Plot,
      poster: formatValue(data.Poster) || fallbackImage,
      actors: formatActors(data.Actors),
      released: formatValue(data.Released),
      totalSeasons: formatValue(data.totalSeasons),
      type: formatValue(data.Type),
      imdbVotes: formatValue(data.imdbVotes),
    };
  };

  const cleanTitleForSearch = (title: string): string => {
    return (
      title
        // Remove números de episódios e temporadas
        .replace(/episódio\s+\d+/i, "")
        .replace(/episodio\s+\d+/i, "")
        .replace(/temporada\s+\d+/i, "")
        .replace(/season\s+\d+/i, "")
        // Remove sufixos comuns de anime
        .replace(/dublado/i, "")
        .replace(/legendado/i, "")
        .replace(/-\s*\d+$/i, "") // Remove números no final após hífen
        .replace(/\s+\d+$/i, "") // Remove números soltos no final
        // Remove caracteres especiais e pontuação
        .replace(/[:.]/g, " ")
        // Remove texto entre parênteses
        .replace(/\([^)]*\)/g, "")
        // Remove texto entre colchetes
        .replace(/\[[^\]]*\]/g, "")
        // Limpa espaços extras
        .trim()
        // Remove espaços duplos
        .replace(/\s+/g, " ")
    );
  };

  const fetchIMDBData = async (title: string) => {
    try {
      const cleanedTitle = cleanTitleForSearch(title);
      const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(
        cleanedTitle
      )}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === "True") {
        const formattedData = formatImdbData(data);
        setImdbData(formattedData);
      } else {
        // Se não encontrar com o título limpo, tenta buscar com palavras-chave
        const keywords = cleanedTitle.split(" ")[0];

        const retryUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(
          keywords
        )}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`;

        const retryResponse = await fetch(retryUrl);
        const retryData = await retryResponse.json();

        if (retryData.Response === "True") {
          const formattedData = formatImdbData(retryData);
          setImdbData(formattedData);
        } else {
          setImdbData(null);
        }
      }
    } catch (error) {
      console.error("❌ Erro ao buscar dados do OMDB:", {
        searchTitle: title,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      setImdbData(null);
    }
  };

  if (!currentEpisode) {
    return <Navigate to="/" replace />;
  }

  const fallbackImage =
    "https://placehold.co/1920x1080/1a1d29/white?text=No+Image+Available";

  const renderStatus = () => {
    if (!imdbData?.type) return null;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Status:</span>
        <span className="text-white">Released</span>
      </div>
    );
  };

  const renderRating = () => {
    if (!imdbData?.rating || imdbData.rating === "N/A") return null;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Rating:</span>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">⭐</span>
          <span className="text-white font-medium">{imdbData.rating}/10</span>
          {imdbData.imdbVotes && (
            <span className="text-gray-400">({imdbData.imdbVotes} votes)</span>
          )}
        </div>
      </div>
    );
  };

  const renderGenres = () => {
    if (!imdbData?.genres?.length) return null;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Genres:</span>
        <div className="flex flex-wrap gap-2">
          {imdbData.genres.map((genre) => (
            <span key={genre} className="text-white">
              {genre}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zax-bg">
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background Image Container */}
        <div className="absolute inset-0 h-[60vh]">
          <div className="relative w-full h-full">
            <img
              src={
                currentEpisode.image ||
                currentEpisode.thumbnail ||
                fallbackImage
              }
              alt={currentEpisode.title}
              className="w-full h-full object-cover object-top"
            />
            {/* Gradiente mais suave e escuro na parte inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-zax-bg via-zax-bg/90 to-transparent" />
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-[1200px] mx-auto relative">
          <div className="px-6">
            {/* Título e Metadados */}
            <div className="pt-[35vh] pb-32">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white">
                  {currentEpisode.title}
                  {currentEpisode.episode && (
                    <span className="block text-xl text-gray-300 mt-2">
                      Episódio {currentEpisode.episode}
                    </span>
                  )}
                </h1>

                <div className="flex items-center gap-4 text-white text-sm">
                  {imdbData ? (
                    <>
                      <span className="flex items-center gap-1">
                        <SiImdb className="text-[#f3ce13] text-xl" />
                        <span className="font-semibold">{imdbData.rating}</span>
                      </span>
                      <span>{imdbData.year}</span>
                      <span className="flex items-center gap-1">
                        <IoTimeOutline />
                        {imdbData.duration}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1">
                        <AiFillStar className="text-yellow-400" />
                        N/A
                      </span>
                      <span>--</span>
                      <span className="flex items-center gap-1">
                        <IoTimeOutline />
                        --
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {imdbData?.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-white/10 text-white rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  )) || (
                    <span className="text-gray-400 text-sm">
                      Carregando gêneros...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 space-y-6">
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                {currentEpisode.playerUrl &&
                  (currentEpisode.playerUrl.includes("http") ? (
                    <iframe
                      src={currentEpisode.playerUrl}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <VideoPlayer
                      url={currentEpisode.playerUrl}
                      title={currentEpisode.title}
                    />
                  ))}
              </div>

              {/* Overview Section */}
              <Section
                title="Overview"
                isOpen={isOverviewOpen}
                onToggle={() => setIsOverviewOpen(!isOverviewOpen)}
                icon={<BsInfoCircle size={20} className="text-purple-400" />}
              >
                <p className="text-gray-300 leading-relaxed">
                  {imdbData?.plot || "Carregando sinopse..."}
                </p>
              </Section>

              {/* Details and Cast Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Details Section */}
                <Section
                  title="Details"
                  isOpen={isDetailsOpen}
                  onToggle={() => setIsDetailsOpen(!isDetailsOpen)}
                  icon={<BsListUl size={20} className="text-purple-400" />}
                >
                  <div className="space-y-4">
                    {renderStatus()}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">Release Date:</span>
                      <span className="text-white">
                        {imdbData?.released || imdbData?.year || "--"}
                      </span>
                    </div>
                    {renderRating()}
                    {renderGenres()}
                  </div>
                </Section>

                {/* Cast Section */}
                {imdbData?.actors && imdbData.actors.length > 0 && (
                  <Section
                    title="Cast"
                    isOpen={true}
                    onToggle={() => {}}
                    icon={<BsPeople size={20} className="text-purple-400" />}
                  >
                    <div className="grid grid-cols-1 gap-4">
                      {imdbData.actors.map((actor) => (
                        <div key={actor} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-purple-400/10 flex items-center justify-center">
                            <BsPerson size={24} className="text-purple-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {actor}
                            </div>
                            <div className="text-gray-400 text-sm">Actor</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
