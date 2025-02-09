import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

type ModalType = "login" | "register" | "forgotPassword";

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  modalType: ModalType;
  openAuthModal: (type: ModalType) => void;
  closeAuthModal: () => void;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  resetPassword: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("login");

  const openAuthModal = (type: ModalType) => {
    setModalType(type);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Simulação de autenticação
  const login = async (email: string) => {
    // Aqui você implementaria a chamada real para sua API
    const mockUser = {
      id: 1,
      name: "Usuário Teste",
      email,
    };
    setUser(mockUser);
    closeAuthModal();
  };

  const register = async (name: string, email: string) => {
    // Aqui você implementaria a chamada real para sua API
    const mockUser = {
      id: 1,
      name,
      email,
    };
    setUser(mockUser);
    closeAuthModal();
  };

  const resetPassword = async () => {
    // Aqui você implementaria a chamada real para sua API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        modalType,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
