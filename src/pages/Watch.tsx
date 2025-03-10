import { Navigate, useParams } from "react-router-dom";
import { useEpisodeStore } from "../store/episodeStore";
import { VideoPlayer } from "../components/player/VideoPlayer";
import { useAnalytics } from "../hooks/useAnalytics";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { SiImdb } from "react-icons/si";
import {
  BsInfoCircle,
  BsListUl,
  BsPeople,
  BsPerson,
  BsPlayCircle,
} from "react-icons/bs";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { useStore } from "../store/useStore";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

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
  const params = useParams();
  const episodeId = params.episodeId;
  const {
    updateWatchHistory,
    isFullyAuthenticated,
    isEpisodeInHistory,
    watchHistory,
  } = useWatchHistory();
  const { user } = useStore();
  const { user: authUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);

  // Efeito para logar informações de autenticação
  useEffect(() => {
    console.log("👤 Watch Component - Auth Info:", {
      storeUser: user,
      authUser,
      isFullyAuthenticated,
      episodeId,
      currentEpisode: currentEpisode?.episode,
      params,
    });
  }, [user, authUser, isFullyAuthenticated, episodeId, currentEpisode, params]);

  // Efeito para verificar se o episódio já está no histórico
  useEffect(() => {
    if (watchHistory && currentEpisode) {
      // Usar o ID fixo conforme o exemplo
      const animeId = "49582";

      // Extrair o número do episódio
      let episodeNumber = 1;
      if (currentEpisode.episode) {
        const episodeMatch = currentEpisode.episode.match(/\d+/);
        if (episodeMatch) {
          episodeNumber = parseInt(episodeMatch[0], 10);
        }
      }

      const isAlreadySaved = isEpisodeInHistory(animeId, episodeNumber);
      setAlreadySaved(isAlreadySaved);

      console.log("🔍 Verificando se episódio já está no histórico:", {
        animeId,
        episodeNumber,
        isAlreadySaved,
      });
    }
  }, [watchHistory, currentEpisode, isEpisodeInHistory]);

  // Função para salvar o progresso
  const saveProgress = async () => {
    if (isSaving) {
      console.log("⏳ Já existe uma operação de salvamento em andamento");
      return;
    }

    console.log("🔍 saveProgress - Verificando condições:", {
      hasCurrentEpisode: !!currentEpisode,
      isFullyAuthenticated,
      storeUserId: user?.id,
      authUserId: authUser?.id,
      episodeId,
      currentEpisode,
      alreadySaved,
    });

    // Usar o ID do usuário do authUser se o user do store não estiver disponível
    const userId = user?.id || authUser?.id;

    if (!currentEpisode || !isFullyAuthenticated || !userId) {
      if (!isFullyAuthenticated) {
        toast.error("Faça login para salvar seu progresso");
      } else if (!userId) {
        console.error("❌ ID do usuário não encontrado");
        toast.error(
          "Erro ao identificar usuário. Por favor, faça login novamente."
        );
      } else if (!currentEpisode) {
        console.error("❌ Episódio atual não encontrado");
      }
      return;
    }

    // Extrair o número do episódio e garantir que seja um número válido
    let episodeNumber = 1; // Valor padrão

    if (currentEpisode.episode) {
      // Tenta extrair apenas os dígitos do número do episódio
      const episodeMatch = currentEpisode.episode.match(/\d+/);
      if (episodeMatch) {
        episodeNumber = parseInt(episodeMatch[0], 10);
      }
    }

    // Verificar se o número do episódio é válido
    if (isNaN(episodeNumber)) {
      console.error("❌ Número do episódio inválido:", currentEpisode.episode);
      episodeNumber = 1; // Usar valor padrão se for inválido
    }

    // Usar o ID fixo conforme o exemplo
    const animeId = "49582";

    // Verificar se o episódio já está no histórico
    if (alreadySaved) {
      console.log(
        "ℹ️ Episódio já está no histórico, não é necessário salvar novamente"
      );
      toast.success("Episódio já está marcado como assistido!");
      return;
    }

    const watchData = {
      user_id: userId,
      anime_id: animeId,
      episode_number: episodeNumber,
      progress_percentage: 0,
      watched_at: new Date().toISOString(),
    };

    console.log("🎬 Tentando salvar progresso do episódio:", {
      ...watchData,
      currentEpisode,
    });

    try {
      setIsSaving(true);
      // Chamar diretamente a API em vez de usar a mutação do React Query
      const response = await api.createOrUpdateWatchHistory(watchData);
      console.log("✅ Progresso salvo com sucesso:", response);
      toast.success("Progresso salvo com sucesso!");
      setAlreadySaved(true);
    } catch (error: any) {
      console.error("❌ Erro ao salvar progresso:", error);

      // Verificar se é um erro de duplicação
      if (
        error.response?.status === 400 &&
        error.response?.data?.error?.includes("duplicate key value")
      ) {
        toast.success("Episódio já está marcado como assistido!");
        setAlreadySaved(true);
      } else {
        toast.error(
          "Erro ao salvar seu progresso. Por favor, tente novamente."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Efeito para salvar o histórico quando o episódio é carregado
  useEffect(() => {
    if (
      currentEpisode &&
      isFullyAuthenticated &&
      (user?.id || authUser?.id) &&
      episodeId
    ) {
      console.log(
        "🔄 Detectada mudança no episódio, tentando salvar progresso:",
        {
          currentEpisode,
          isFullyAuthenticated,
          storeUserId: user?.id,
          authUserId: authUser?.id,
          episodeId,
        }
      );
      saveProgress();
    }
  }, [
    currentEpisode?.episode,
    isFullyAuthenticated,
    user?.id,
    authUser?.id,
    episodeId,
  ]);

  useEffect(() => {
    if (currentEpisode) {
      trackPageView(`/watch/${currentEpisode.playerUrl}`);
      trackEvent({
        action: "play_video",
        category: "content",
        label: `${currentEpisode.title} - Episode ${currentEpisode.episode}`,
      });

      // Buscar dados do IMDB
      if (currentEpisode.title) {
        fetchIMDBData(currentEpisode.title);
      }
    }
  }, [currentEpisode]);

  // Função para buscar dados do IMDB
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
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados do IMDB:", error);
    }
  };

  // Função para limpar o título para busca
  const cleanTitleForSearch = (title: string): string => {
    return (
      title
        .replace(/\s*\([^)]*\)\s*/g, " ") // Remove texto entre parênteses
        .replace(/\s*\[[^\]]*\]\s*/g, " ") // Remove texto entre colchetes
        .replace(/\s*-\s*.*$/, "") // Remove tudo após um hífen
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

  // Se não tiver episódio atual, redirecionar para a home
  if (!currentEpisode) {
    return <Navigate to="/" />;
  }

  const fallbackImage =
    "https://via.placeholder.com/300x450?text=No+Poster+Available";

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

  // Renderiza o status do anime
  const renderStatus = () => {
    if (!imdbData) return null;

    return (
      <div className="flex items-center gap-2">
        <IoCalendarOutline size={20} className="text-purple-400 shrink-0" />
        <span className="text-gray-300">
          {imdbData.year || "Ano desconhecido"}
        </span>
      </div>
    );
  };

  // Renderiza a classificação do anime
  const renderRating = () => {
    if (!imdbData || !imdbData.rating || imdbData.rating === "N/A") return null;

    return (
      <div className="flex items-center gap-2">
        <AiFillStar size={20} className="text-yellow-400 shrink-0" />
        <span className="text-gray-300">{imdbData.rating}/10</span>
      </div>
    );
  };

  // Renderiza os gêneros do anime
  const renderGenres = () => {
    if (!imdbData || !imdbData.genres || imdbData.genres.length === 0)
      return null;

    return (
      <div className="flex flex-wrap gap-2">
        {imdbData.genres.map((genre) => (
          <span
            key={genre}
            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
          >
            {genre}
          </span>
        ))}
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
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Título e Informações */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentEpisode?.title || "Carregando..."}
            </h1>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <BsPlayCircle />
                Episódio {currentEpisode?.episode || "?"}
              </span>
              {imdbData?.rating && imdbData.rating !== "N/A" && (
                <span className="flex items-center gap-1">
                  <SiImdb className="text-yellow-400" />
                  {imdbData.rating}/10
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal - Player e Informações */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                {currentEpisode?.playerUrl ? (
                  <>
                    <iframe
                      src={currentEpisode.playerUrl}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      onLoad={() => {
                        console.log(
                          "🎥 Iframe carregado, tentando salvar progresso"
                        );
                        if (!alreadySaved) {
                          saveProgress();
                        }
                      }}
                    />
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(
                            "🎯 Botão 'Marcar como assistido' clicado"
                          );
                          saveProgress();
                        }}
                        className={`px-4 py-2 ${
                          alreadySaved
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-purple-600 hover:bg-purple-700"
                        } text-white rounded transition-colors`}
                        disabled={isSaving}
                      >
                        {isSaving
                          ? "Salvando..."
                          : alreadySaved
                          ? "Episódio assistido ✓"
                          : "Marcar como assistido"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Carregando player...
                  </div>
                )}
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
                  title="Detalhes"
                  isOpen={isDetailsOpen}
                  onToggle={() => setIsDetailsOpen(!isDetailsOpen)}
                  icon={<BsListUl size={20} className="text-purple-400" />}
                >
                  <div className="space-y-3">
                    {renderStatus()}
                    {renderRating()}
                    {renderGenres()}
                    {imdbData?.duration && imdbData.duration !== "N/A" && (
                      <div className="flex items-center gap-2">
                        <IoTimeOutline
                          size={20}
                          className="text-purple-400 shrink-0"
                        />
                        <span className="text-gray-300">
                          {imdbData.duration}
                        </span>
                      </div>
                    )}
                  </div>
                </Section>

                {/* Cast Section */}
                {imdbData?.actors && imdbData.actors.length > 0 && (
                  <Section
                    title="Elenco"
                    isOpen={isDetailsOpen}
                    onToggle={() => setIsDetailsOpen(!isDetailsOpen)}
                    icon={<BsPeople size={20} className="text-purple-400" />}
                  >
                    <div className="space-y-3">
                      {imdbData.actors.map((actor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <BsPerson
                            size={20}
                            className="text-purple-400 shrink-0"
                          />
                          <span className="text-gray-300">{actor}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </div>
            </div>

            {/* Coluna Lateral - Poster */}
            <div>
              {imdbData?.poster && (
                <img
                  src={imdbData.poster}
                  alt={`Poster de ${currentEpisode?.title || "anime"}`}
                  className="w-full rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
