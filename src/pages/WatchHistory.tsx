import { useEffect } from "react";
import { useWatchHistory } from "../hooks/useWatchHistory";

import { useAnalytics } from "../hooks/useAnalytics";
import { IoTimeOutline } from "react-icons/io5";
import { BsPlayCircle } from "react-icons/bs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useStore } from "../store/useStore";
import { Auth } from "../components/Auth";

export function WatchHistory() {
  const { watchHistory, isLoadingHistory } = useWatchHistory();
  const { trackPageView } = useAnalytics();
  const { user } = useStore();

  useEffect(() => {
    trackPageView("/history");
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-zax-bg flex items-center justify-center">
        <div className="bg-[#1a1d29] p-8 rounded-lg max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Faça login para ver seu histórico
          </h2>
          <p className="text-gray-400 mb-6">
            Para ver seu histórico de visualização, faça login ou crie uma
            conta.
          </p>
          <Auth />
        </div>
      </div>
    );
  }

  if (isLoadingHistory) {
    return (
      <div className="min-h-screen bg-zax-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zax-bg">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Histórico de Visualização
        </h1>

        {!watchHistory || watchHistory.length === 0 ? (
          <div className="bg-[#1a1d29] rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">
              Você ainda não assistiu nenhum episódio.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {watchHistory.map((item) => (
              <div
                key={`${item.anime_id}-${item.episode_number}`}
                className="bg-[#1a1d29] rounded-lg overflow-hidden hover:bg-white/5 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium text-lg">
                        {item.anime_id}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <BsPlayCircle />
                          Episódio {item.episode_number}
                        </span>
                        <span className="flex items-center gap-1">
                          <IoTimeOutline />
                          {format(
                            new Date(item.watched_at),
                            "dd 'de' MMMM 'às' HH:mm",
                            {
                              locale: ptBR,
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-400">
                        {item.progress_percentage}% assistido
                      </div>
                      <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${item.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
