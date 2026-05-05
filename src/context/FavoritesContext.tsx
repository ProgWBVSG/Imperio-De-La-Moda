"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/app/catalogo/page";

// We'll store basic product info in favorites so we can display them 
// without needing to refetch all product data if possible.
export interface FavoriteItem {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  precio_mayorista: number;
  precio_minorista: number;
  imagen: string;
  en_promo?: boolean;
  precio_minorista_promo?: number;
  precio_mayorista_promo?: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (product: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [inited, setInited] = useState(false);
  const [toast, setToast] = useState<{message: string, isAdded: boolean, id: number} | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("imperio_favoritos");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Error cargando favoritos", e);
      }
    }
    setInited(true);
  }, []);

  useEffect(() => {
    if (inited) {
      localStorage.setItem("imperio_favoritos", JSON.stringify(favorites));
    }
  }, [favorites, inited]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleFavorite = (product: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === product.id);
      if (exists) {
        setToast({ message: `Quitado de favoritos`, isAdded: false, id: Date.now() });
        return prev.filter((fav) => fav.id !== product.id);
      } else {
        setToast({ message: `¡Guardado en favoritos! ❤️`, isAdded: true, id: Date.now() });
        return [...prev, product];
      }
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.id === id);
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, favoritesCount }}>
      {children}
      
      {/* GLOBAL FAVORITES TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl border border-gray-700 flex items-center gap-3">
            <span className="font-bold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }
  return context;
}
