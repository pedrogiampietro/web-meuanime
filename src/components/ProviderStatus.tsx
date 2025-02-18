import { useState, useEffect } from "react";
import { api } from "../services/api";
import { CircleNotch, CheckCircle, XCircle } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProviderStatusProps {
  isLoading: boolean;
  centered?: boolean;
}

type ProviderState = {
  name: string;
  status: "waiting" | "loading" | "success" | "error";
};

export function ProviderStatus({ centered }: ProviderStatusProps) {
  const [providers, setProviders] = useState<ProviderState[]>([
    { name: "Goyabu", status: "waiting" },
    { name: "AnimesOnlineCC", status: "waiting" },
  ]);

  useEffect(() => {
    const checkProviders = async () => {
      setProviders((prev) =>
        prev.map((p) => (p.name === "Goyabu" ? { ...p, status: "loading" } : p))
      );

      try {
        const goyabuResults = await api.searchAnime("latest", "goyabu");

        if (goyabuResults && goyabuResults.length > 0) {
          setProviders((prev) =>
            prev.map((p) =>
              p.name === "Goyabu" ? { ...p, status: "success" } : p
            )
          );
          return;
        }

        setProviders((prev) =>
          prev.map((p) => (p.name === "Goyabu" ? { ...p, status: "error" } : p))
        );

        setProviders((prev) =>
          prev.map((p) =>
            p.name === "AnimesOnlineCC" ? { ...p, status: "loading" } : p
          )
        );

        const animesonlineccResults = await api.searchAnime(
          "latest",
          "animesonlinecc"
        );

        if (animesonlineccResults && animesonlineccResults.length > 0) {
          setProviders((prev) =>
            prev.map((p) =>
              p.name === "AnimesOnlineCC" ? { ...p, status: "success" } : p
            )
          );
          return;
        }

        setProviders((prev) =>
          prev.map((p) =>
            p.name === "AnimesOnlineCC" ? { ...p, status: "error" } : p
          )
        );
      } catch (error) {
        setProviders((prev) =>
          prev.map((p) =>
            p.status === "loading" ? { ...p, status: "error" } : p
          )
        );
      }
    };

    checkProviders();
  }, []);

  const containerClasses = centered
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "fixed bottom-4 right-4 z-50";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={containerClasses}
      >
        <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg backdrop-blur-sm space-y-3">
          {providers.map((provider) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                flex items-center justify-between gap-4 p-3 rounded
                ${
                  provider.status === "loading"
                    ? "bg-blue-500/10 border border-blue-500/20"
                    : ""
                }
                ${
                  provider.status === "success"
                    ? "bg-green-500/10 border border-green-500/20"
                    : ""
                }
                ${
                  provider.status === "error"
                    ? "bg-red-500/10 border border-red-500/20"
                    : ""
                }
                ${
                  provider.status === "waiting"
                    ? "bg-zinc-800/50 border border-zinc-700/20"
                    : ""
                }
              `}
            >
              <span className="text-sm text-zinc-300">{provider.name}</span>
              <div className="flex items-center gap-2">
                {provider.status === "loading" && (
                  <CircleNotch
                    weight="bold"
                    className="w-5 h-5 text-blue-500 animate-spin"
                  />
                )}
                {provider.status === "success" && (
                  <CheckCircle
                    weight="bold"
                    className="w-5 h-5 text-green-500"
                  />
                )}
                {provider.status === "error" && (
                  <XCircle weight="bold" className="w-5 h-5 text-red-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
