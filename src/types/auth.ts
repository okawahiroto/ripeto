import type { User } from 'firebase/auth';

export type AuthStatus = 'loading' | 'anonymous' | 'linked';

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
}
