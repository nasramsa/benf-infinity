import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
}

interface AuthStore {
  token: string | null;
  client: Client | null;
  setAuth: (token: string, client: Client) => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      client: null,

      setAuth: (token, client) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ token, client });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ token: null, client: null });
      },
    }),
    {
      name: 'benf-auth',
    }
  )
);
