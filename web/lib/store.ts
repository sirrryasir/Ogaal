import { create } from "zustand";

type UserRole = "admin" | "community";

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: "community",
  setRole: (role) => set({ role }),
  isOffline: false,
  setOffline: (offline) => set({ isOffline: offline }),
}));
