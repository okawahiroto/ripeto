import { create } from 'zustand';
import type { AuthState, AuthStatus } from '@/src/types/auth';
import type { User } from 'firebase/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  setUser: (user: User | null) => set({ user }),
  setStatus: (status: AuthStatus) => set({ status }),
}));
