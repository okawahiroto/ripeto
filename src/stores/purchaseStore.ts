import { create } from 'zustand';

interface PurchaseState {
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
}

export const usePurchaseStore = create<PurchaseState>((set) => ({
  isPremium: false,
  setIsPremium: (value) => set({ isPremium: value }),
}));
