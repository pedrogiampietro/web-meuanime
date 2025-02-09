import { create } from "zustand";
import { StateCreator } from "zustand";

interface User {
  // Define user properties
  id: string;
  name: string;
  email: string;
}

interface AppState {
  // Estado para autenticação
  user: User | null;
  isAuthenticated: boolean;
  // Estado para UI
  isLoading: boolean;
  // Ações
  setUser: (user: User | null) => void;
  setIsAuthenticated: (status: boolean) => void;
  setIsLoading: (status: boolean) => void;
  logout: () => void;
}

export const useStore = create<AppState>(((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user: User | null) => set({ user }),
  setIsAuthenticated: (status: boolean) => set({ isAuthenticated: status }),
  setIsLoading: (status: boolean) => set({ isLoading: status }),
  logout: () => set({ user: null, isAuthenticated: false }),
})) as StateCreator<AppState>);
