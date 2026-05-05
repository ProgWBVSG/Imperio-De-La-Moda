"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';

export default function FavoritosPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { agregarItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    agregarItem({
      id: `${product.id}-Único-Único`, // default fallback
      productoId: product.id,
      nombre: product.nombre,
      precio_mayorista: product.precio_mayorista_promo || product.precio_mayorista,
      precio_minorista: product.precio_minorista_promo || product.precio_minorista,
      cantidad: 1,
      talle: "Único",
      color: "Único",
      imagen: product.imagen
    });
  };

  return (
    <div className="bg-bg min-h-screen pb-20 pt-28">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="mb-8 border-b border-border pb-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-primary flex items-center gap-3">
              Tus Favoritos ❤️
            </h1>
            <p className="text-gray-500 mt-2">
              Productos que guardaste para ver más tarde. ¡No te quedes sin stock!
            </p>
          </div>
          <span className="bg-accent/10 text-accent font-bold px-4 py-2 rounded-full hidden md:block">
            {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">Aún no hay favoritos</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Navegá por el catálogo y tocá el corazón en los productos que más te gusten para guardarlos acá.
            </p>
            <Link 
              href="/catalogo"
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-accent hover:text-primary transition-colors inline-block"
            >
              Descubrir productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favorites.map((product) => (
              <Link href={`/producto/${product.slug}`} key={product.id} className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all flex flex-col h-full relative">
                
                {/* Botón de quitar de favoritos */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(product);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-red-500 hover:scale-110 transition-all z-20"
                  aria-label="Quitar favorito"
                >
                  <svg className="w-5 h-5 fill-red-500" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                  {product.imagen ? (
                    <Image 
                      src={product.imagen} 
                      alt={product.nombre} 
                      fill 
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sin foto
                    </div>
                  )}

                  {product.en_promo && product.precio_minorista_promo && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1 z-10">
                      <span className="text-base">🔥</span>
                      Promo
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <span className="text-xs text-gray-400 capitalize mb-1">{product.categoria}</span>
                  <h3 className="font-bold text-primary line-clamp-2 leading-tight mb-2 group-hover:text-accent transition-colors">{product.nombre}</h3>
                  
                  <div className="mt-auto space-y-1">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-xs text-gray-500">Minorista</span>
                      {product.en_promo && product.precio_minorista_promo ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 line-through">${product.precio_minorista.toLocaleString('es-AR')}</span>
                          <span className="font-bold text-red-600">${product.precio_minorista_promo.toLocaleString('es-AR')}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900">${product.precio_minorista.toLocaleString('es-AR')}</span>
                      )}
                    </div>
                    
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-sm hover:bg-accent hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Al Carrito
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
