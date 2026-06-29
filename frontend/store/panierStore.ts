import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ArticlePanier {
  varianteId: number;
  produitNom: string;
  taille: string;
  couleur: string;
  prix: number;
  quantite: number;
  imageUrl?: string;
}

interface PanierStore {
  articles: ArticlePanier[];
  ajouterArticle: (article: ArticlePanier) => void;
  retirerArticle: (varianteId: number) => void;
  mettreAJourQuantite: (varianteId: number, quantite: number) => void;
  viderPanier: () => void;
  total: () => number;
}

export const usePanier = create<PanierStore>()(
  // persist = sauvegarde le panier dans localStorage
  persist(
    (set, get) => ({
      articles: [],

      ajouterArticle: (article) => {
        set((state) => {
          const existant = state.articles.find(a => a.varianteId === article.varianteId);
          if (existant) {
            return {
              articles: state.articles.map(a =>
                a.varianteId === article.varianteId
                  ? { ...a, quantite: a.quantite + article.quantite }
                  : a
              ),
            };
          }
          return { articles: [...state.articles, article] };
        });
      },

      retirerArticle: (varianteId) =>
        set((state) => ({
          articles: state.articles.filter(a => a.varianteId !== varianteId),
        })),

      mettreAJourQuantite: (varianteId, quantite) =>
        set((state) => ({
          articles: state.articles.map(a =>
            a.varianteId === varianteId ? { ...a, quantite } : a
          ),
        })),

      viderPanier: () => set({ articles: [] }),

      total: () => get().articles.reduce((sum, a) => sum + a.prix * a.quantite, 0),
    }),
    { name: 'benf-panier' }
  )
);