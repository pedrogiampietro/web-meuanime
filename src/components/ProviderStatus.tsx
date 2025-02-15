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
  const containerClasses = centered
    ? "flex items-center justify-center min-h-[300px]"
    : "fixed bottom-4 right-4 bg-zinc-900 p-4 rounded-lg shadow-lg";

  const statusContainerClasses = centered
    ? "bg-zinc-900/90 p-8 rounded-lg shadow-lg max-w-md w-full"
    : "";

  return (
    <div className={containerClasses}>
      <div className={statusContainerClasses}>
        <h3 className="text-sm font-medium text-zinc-300 mb-4 text-center">
          Buscando Episódios
        </h3>
        <div className="space-y-3">
          <AnimatePresence>
            {results.map(({ provider, success, loading, error }) => (
              <motion.div
                key={provider}
                initial={{ opacity: 0.5, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: loading ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`
                  flex items-center justify-between gap-4 p-3 rounded
                  transition-all duration-200
                  ${
                    loading
                      ? "bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/10"
                      : success
                      ? "bg-green-500/10 border border-green-500/20"
                      : error
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-zinc-800/50 border border-zinc-700/20"
                  }
                `}
              >
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-300 capitalize flex items-center gap-2">
                    {provider}
                    {loading && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-blue-400 font-medium"
                      >
                        tentando...
                      </motion.span>
                    )}
                  </span>
                  {error && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-red-400 mt-1"
                    >
                      {error}
                    </motion.span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    {loading ? (
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
                    ) : success ? (
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
                    ) : error ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <XCircle
                          weight="bold"
                          className="w-5 h-5 text-red-500"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="waiting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                      >
                        <CircleNotch
                          weight="bold"
                          className="w-5 h-5 text-zinc-500"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
