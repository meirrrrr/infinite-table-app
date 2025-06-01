import { create } from "zustand";

interface UserIdState {
  lastId: number;
  setLastId: (id: number) => void;
  getNextId: () => number;
}

export const useUserIdStore = create<UserIdState>((set, get) => ({
  lastId: 0,

  setLastId: (id: number) => {
    set({ lastId: id });
  },

  getNextId: () => {
    const next = get().lastId + 1;
    set({ lastId: next });
    return next;
  },
}));
