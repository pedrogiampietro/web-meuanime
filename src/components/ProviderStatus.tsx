import { useState, useEffect } from "react";
import { AnimeProvider, AnimeEpisode } from "../services/api";
import { CircleNotch, CheckCircle, XCircle } from "phosphor-react";
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

  // Encontra o provider que está carregando
  const loadingProvider = results.find((r) => r.loading);
  // Encontra o provider que teve sucesso
  const successProvider = results.find((r) => r.success);

  useEffect(() => {
    // Quando encontrar um provider com sucesso
    if (successProvider && !showSuccess) {
      setShowSuccess(true);
      // Agenda o fechamento após mostrar o sucesso por 2 segundos
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successProvider, showSuccess]);

  if (!show) return null;

  const containerClasses = centered
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "fixed bottom-4 right-4 z-50";

  const statusContainerClasses = centered
    ? "bg-zinc-900/90 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm"
    : "bg-zinc-900 p-4 rounded-lg shadow-lg";

  // Determina qual provider mostrar
  const providerToShow = showSuccess ? successProvider : loadingProvider;
  if (!providerToShow) return null;

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
              key={providerToShow.provider}
              initial={{ opacity: 0.5, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: providerToShow.loading ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={`
                flex items-center justify-between gap-4 p-3 rounded
                transition-all duration-200
                ${
                  providerToShow.loading
                    ? "bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/10"
                    : providerToShow.success
                    ? "bg-green-500/10 border border-green-500/20"
                    : providerToShow.error
                    ? "bg-red-500/10 border border-red-500/20"
                    : "bg-zinc-800/50 border border-zinc-700/20"
                }
              `}
            >
              <div className="flex flex-col">
                <span className="text-sm text-zinc-300 capitalize flex items-center gap-2">
                  {providerToShow.provider}
                  {providerToShow.loading && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-blue-400 font-medium"
                    >
                      tentando...
                    </motion.span>
                  )}
                </span>
                {providerToShow.error && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-400 mt-1"
                  >
                    {providerToShow.error}
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {providerToShow.loading ? (
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
                  ) : providerToShow.success ? (
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
                  ) : providerToShow.error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <XCircle weight="bold" className="w-5 h-5 text-red-500" />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
