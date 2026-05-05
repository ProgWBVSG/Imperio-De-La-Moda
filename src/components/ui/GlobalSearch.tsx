"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Producto {
  id: string;
  slug: string;
  nombre: string;
  precio_mayorista: number;
  precio_minorista: number;
  fotos: string[];
  categoria: string;
  stock: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Producto[]>([]);
  const [results, setResults] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Foco automático en el input al abrir y fetch de productos base
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Evitar scroll de fondo
      setTimeout(() => inputRef.current?.focus(), 100);
      
      // Fetch initial data if empty
      if (allProducts.length === 0) {
        setIsLoading(true);
        fetch("/api/productos")
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) setAllProducts(data);
          })
          .catch((err) => console.error("Error fetching search products:", err))
          .finally(() => setIsLoading(false));
      }
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
  }, [isOpen, allProducts.length]);

  // Filtro en tiempo real (instantáneo del lado del cliente)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = allProducts.filter((p) => {
      return (
        p.nombre.toLowerCase().includes(searchTerm) ||
        p.categoria.toLowerCase().includes(searchTerm)
      );
    });
    
    // Sort to prioritize exact category matches or name starts
    filtered.sort((a, b) => {
      const aName = a.nombre.toLowerCase();
      const bName = b.nombre.toLowerCase();
      if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
      if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) return 1;
      return 0;
    });

    setResults(filtered.slice(0, 8)); // Limitar a los mejores 8 resultados
  }, [query, allProducts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-bg/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* Header Modal */}
      <div className="flex items-center justify-between p-4 md:p-8 max-w-5xl mx-auto w-full">
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-accent transition-colors bg-white rounded-full shadow-sm hover:shadow-md"
          aria-label="Cerrar búsqueda"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Input de Búsqueda */}
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 flex-none">
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar prendas, categorías..."
            className="w-full bg-transparent border-b-2 border-gray-200 focus:border-accent text-3xl md:text-5xl lg:text-6xl text-primary placeholder-gray-300 outline-none pb-4 md:pb-6 transition-colors font-display font-bold"
          />
          <svg 
            className={`absolute right-4 bottom-4 md:bottom-6 w-8 h-8 md:w-10 md:h-10 transition-colors ${query ? 'text-accent' : 'text-gray-200 group-focus-within:text-accent'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Resultados */}
      <div className="flex-1 overflow-y-auto mt-8 px-4 md:px-8 w-full max-w-6xl mx-auto pb-20">
        {isLoading && query.length > 0 && results.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-2">
                <div className="bg-gray-200 rounded-xl aspect-[3/4] w-full"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : query && results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 font-display">No encontramos resultados para "<span className="text-primary">{query}</span>"</p>
            <button 
              onClick={() => { onClose(); router.push('/catalogo'); }}
              className="mt-6 text-accent font-bold hover:underline"
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {results.map((product) => (
              <Link 
                href={`/producto/${product.slug}`} 
                key={product.id} 
                onClick={onClose}
                className="group flex flex-col gap-3"
              >
                <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-xl overflow-hidden border border-border">
                  {product.fotos && product.fotos[0] ? (
                    <Image 
                      src={product.fotos[0]} 
                      alt={product.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Agotado</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-primary font-bold line-clamp-1 group-hover:text-accent transition-colors">{product.nombre}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-whatsapp font-bold text-sm">${product.precio_mayorista.toLocaleString('es-AR')} <span className="text-[10px] font-normal uppercase text-gray-400">Por Mayor</span></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {/* Categorías sugeridas si no hay búsqueda */}
        {!query && (
          <div className="mt-8 opacity-60">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Sugerencias</p>
            <div className="flex flex-wrap gap-3">
              {['Pantalones', 'Remeras', 'Camperas', 'Buzos', 'Promos'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setQuery(cat)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-accent hover:text-accent transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
