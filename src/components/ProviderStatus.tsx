import { useState, useEffect } from "react";
import { AnimeProvider, AnimeEpisode } from "../services/api";
import { CircleNotch, CheckCircle } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProviderStatusProps {
  results: {
    data: AnimeEpisode[] | null;
    provider: AnimeProvider;
    success: boolean;
    loading: boolean;
    error?: string;
  }[];
  isLoading: boolean;
  centered: boolean;
}

export function ProviderStatus({
  results,
  isLoading,
  centered,
}: ProviderStatusProps) {
  const [show, setShow] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Encontra o provider ativo
  const activeProvider = results.find((r) => r.loading || r.success);

  useEffect(() => {
    // Remova o timer e a lógica de fechamento do modal
    if (activeProvider?.success && !showSuccess) {
      console.log("Provider succeeded, showing success state");
      setShowSuccess(true); // Atualiza o estado para mostrar o ícone de sucesso
    }
  }, [activeProvider?.success, showSuccess]); // Dependências do useEffect

  // Se não houver provider ativo ou o modal não deve ser mostrado, retorna null
  if (!show || !activeProvider) return null;

  const containerClasses = centered
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "fixed bottom-4 right-4 z-50";

  const statusContainerClasses = centered
    ? "bg-zinc-900/90 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm"
    : "bg-zinc-900 p-4 rounded-lg shadow-lg";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={containerClasses}
      >
        <div className={statusContainerClasses}>
          <div className="space-y-3">
            <motion.div
              key={activeProvider.provider}
              initial={{ opacity: 0.5, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: activeProvider.loading ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`
                flex items-center justify-between gap-4 p-3 rounded
                transition-colors duration-300 ease-in-out
                ${
                  !showSuccess
                    ? "bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/10"
                    : "bg-green-500/10 border border-green-500/20 shadow-lg shadow-green-500/10"
                }
              `}
            >
              <div className="flex flex-col">
                <span className="text-sm text-zinc-300 capitalize flex items-center gap-2">
                  {activeProvider.provider}
                  {!showSuccess && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-blue-400 font-medium"
                    >
                      tentando...
                    </motion.span>
                  )}
                </span>
                {activeProvider.error && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-400 mt-1"
                  >
                    {activeProvider.error}
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {!showSuccess ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <CircleNotch
                        weight="bold"
                        className="w-5 h-5 text-blue-500 animate-spin"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <CheckCircle
                        weight="bold"
                        className="w-5 h-5 text-green-500"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
