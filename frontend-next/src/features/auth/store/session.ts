import { create } from "zustand";
import type { UserSession } from "@/features/auth/types";

type SessionState = { user: UserSession | null; setUser: (user: UserSession) => void; clear: () => void };
export const useSession = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => { if (typeof window !== "undefined") { localStorage.removeItem("token"); localStorage.removeItem("user"); } set({ user: null }); },
}));
