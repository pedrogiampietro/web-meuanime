import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiLock, FiUser, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export function AuthModal() {
  const {
    isAuthModalOpen,
    modalType,
    closeAuthModal,
    login,
    register,
    resetPassword,
    openAuthModal,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (modalType === "login") {
        await login(email, password);
      } else if (modalType === "register") {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem");
        }
        await register(name, email, password);
      } else if (modalType === "forgotPassword") {
        await resetPassword(email);
        setSuccessMessage("Email de recuperação enviado com sucesso!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setError("");
    setSuccessMessage("");
  };

  const handleModalChange = (type: "login" | "register" | "forgotPassword") => {
    resetForm();
    openAuthModal(type);
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closeAuthModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zax-secondary p-8 rounded-lg w-full max-w-md relative"
          >
            <button
              onClick={closeAuthModal}
              className="absolute right-4 top-4 text-zax-text hover:text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            {modalType !== "login" && (
              <button
                onClick={() => handleModalChange("login")}
                className="absolute left-4 top-4 text-zax-text hover:text-white transition-colors flex items-center gap-2"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </button>
            )}

            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {modalType === "login"
                ? "Entrar"
                : modalType === "register"
                ? "Criar Conta"
                : "Recuperar Senha"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-500 rounded-lg text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-500 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === "register" && (
                <div>
                  <label className="block text-sm font-medium text-zax-text mb-1">
                    Nome
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zax-text" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zax-bg text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zax-primary"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zax-text mb-1">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zax-text" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zax-bg text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zax-primary"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {modalType !== "forgotPassword" && (
                <div>
                  <label className="block text-sm font-medium text-zax-text mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zax-text" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zax-bg text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zax-primary"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              {modalType === "register" && (
                <div>
                  <label className="block text-sm font-medium text-zax-text mb-1">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zax-text" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-zax-bg text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zax-primary"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zax-primary text-white py-2 rounded-lg hover:bg-zax-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processando...
                  </span>
                ) : modalType === "login" ? (
                  "Entrar"
                ) : modalType === "register" ? (
                  "Criar Conta"
                ) : (
                  "Enviar Email de Recuperação"
                )}
              </button>
            </form>

            <div className="mt-4 text-center space-y-2">
              {modalType === "login" && (
                <>
                  <button
                    onClick={() => handleModalChange("register")}
                    className="text-zax-text hover:text-white transition-colors block w-full"
                  >
                    Não tem uma conta? Criar conta
                  </button>
                  <button
                    onClick={() => handleModalChange("forgotPassword")}
                    className="text-zax-text hover:text-white transition-colors block w-full"
                  >
                    Esqueceu sua senha?
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
