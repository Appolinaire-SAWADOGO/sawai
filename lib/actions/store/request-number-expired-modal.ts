import { create } from "zustand";

type UseRequestNumberExpiredModalType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const UseRequestNumberExpiredModal =
  create<UseRequestNumberExpiredModalType>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }));
