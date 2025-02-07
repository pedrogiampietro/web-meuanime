import { create } from "zustand";

interface AppState {
  // Estado para autenticação
  user: any | null;
  isAuthenticated: boolean;
  // Estado para UI
  isLoading: boolean;
  // Ações
  setUser: (user: any) => void;
  setIsAuthenticated: (status: boolean) => void;
  setIsLoading: (status: boolean) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user }),
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
  setIsLoading: (status) => set({ isLoading: status }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
