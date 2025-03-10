import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { WatchHistory, AnimeWatchStatus } from "../types/anime";
import { useStore } from "../store/useStore";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

export function useWatchHistory() {
  const { user: storeUser } = useStore();
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  // Verifica se o usuário está autenticado em pelo menos um dos contextos
  const isFullyAuthenticated = !!storeUser || !!authUser;
  const userId = storeUser?.id || authUser?.id;

  console.log("🔐 useWatchHistory - Auth state:", {
    storeUserId: storeUser?.id,
    authUserId: authUser?.id,
    isFullyAuthenticated,
    userId,
  });

  const {
    data: watchHistory,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ["watchHistory", userId],
    queryFn: () => (userId ? api.getUserWatchHistory(userId) : null),
    enabled: isFullyAuthenticated && !!userId,
    retry: 1,
  });

  const { mutate: updateWatchHistory, isPending: isUpdating } = useMutation({
    mutationFn: async (watchData: WatchHistory) => {
      if (!isFullyAuthenticated) {
        console.error(
          "❌ Cannot update watch history - user not authenticated"
        );
        throw new Error("User not authenticated");
      }

      if (!watchData.user_id) {
        console.error(
          "❌ Cannot update watch history - missing user_id in watchData"
        );
        throw new Error("Missing user_id in watch data");
      }

      console.log("🔄 Mutation - updateWatchHistory called with:", watchData);

      try {
        const response = await api.createOrUpdateWatchHistory(watchData);
        console.log("✅ Watch history updated successfully:", response);
        return response;
      } catch (error: any) {
        console.error("❌ Error updating watch history:", {
          error,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });

        if (
          error.response?.status === 400 &&
          error.response?.data?.error?.includes("row-level security policy")
        ) {
          throw new Error(
            "Erro de permissão ao salvar o histórico. Por favor, faça login novamente."
          );
        }

        throw error;
      }
    },
    onSuccess: (data) => {
      console.log(
        "🔄 Invalidating watch history queries after successful update:",
        data
      );
      queryClient.invalidateQueries({
        queryKey: ["watchHistory", data.user_id],
      });
      toast.success("Progresso salvo com sucesso!");
    },
    onError: (error: any) => {
      console.error("❌ Watch history mutation error:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      toast.error(
        error.message ||
          "Erro ao salvar o histórico. Por favor, tente novamente."
      );
    },
  });

  const getAnimeWatchStatus = async (
    animeId: string
  ): Promise<AnimeWatchStatus | null> => {
    if (!isFullyAuthenticated || !userId) {
      console.log("⚠️ Cannot get watch status - user not authenticated");
      return null;
    }
    try {
      console.log("🔍 Getting watch status for:", { userId, animeId });
      const status = await api.getAnimeWatchStatus(userId, animeId);
      console.log("📊 Watch status retrieved:", status);
      return status;
    } catch (error: any) {
      console.error("❌ Error fetching anime watch status:", {
        error,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (
        error.response?.status === 400 &&
        error.response?.data?.error?.includes("row-level security policy")
      ) {
        toast.error(
          "Erro de permissão ao verificar status. Por favor, faça login novamente."
        );
      }
      return null;
    }
  };

  // Função para verificar se um episódio já está no histórico
  const isEpisodeInHistory = (
    animeId: string,
    episodeNumber: number
  ): boolean => {
    if (!watchHistory) return false;

    return watchHistory.some(
      (item) =>
        item.anime_id === animeId && item.episode_number === episodeNumber
    );
  };

  return {
    watchHistory,
    isLoadingHistory,
    historyError,
    updateWatchHistory,
    isUpdating,
    getAnimeWatchStatus,
    isFullyAuthenticated,
    isEpisodeInHistory,
  };
}
