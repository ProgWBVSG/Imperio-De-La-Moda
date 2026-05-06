"use client";

import { useState } from "react";
import { useCart, CartItem } from "@/context/CartContext";
import Link from "next/link";
import SizeGuideModal from "@/components/ui/SizeGuideModal";

import { useFavorites } from "@/context/FavoritesContext";

interface ProductProps {
  product: {
    id: string;
    slug?: string;
    nombre: string;
    precio_mayorista: number;
    precio_minorista: number;
    talles: string[];
    colores: string[];
    fotos: string[];
    stock: number;
    categoria?: string;
    en_promo?: boolean;
    precio_minorista_promo?: number;
    precio_mayorista_promo?: number;
  };
}

export function ProductAddToCart({ product }: ProductProps) {
  const { agregarItem, generarMensajeProducto } = useCart();

  const [selectedTalle, setSelectedTalle] = useState(product.talles?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colores?.[0] || "");
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const handleAdd = () => {
    if (product.stock <= 0) return;

    const uniqueId = `${product.id}-${selectedTalle}-${selectedColor}`;

    const item: CartItem = {
      id: uniqueId,
      productoId: product.id,
      nombre: product.nombre,
      precio_mayorista: product.precio_mayorista,
      precio_minorista: product.precio_minorista,
      cantidad,
      talle: selectedTalle,
      color: selectedColor,
      imagen: product.fotos?.[0] || "",
    };

    agregarItem(item);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2500);
  };

  // Mensaje individual para WhatsApp directo
  const whatsappUrl = generarMensajeProducto({
    nombre: product.nombre,
    talle: selectedTalle,
    color: selectedColor,
    cantidad: cantidad,
  });

  return (
    <div className="bg-white border border-border p-6 rounded-xl shadow-sm space-y-6 mb-8">
      {/* Selectores */}
      <div className="space-y-5">
        {/* Talles */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-xs font-bold text-primary uppercase tracking-wider">
              Talle: <span className="text-gray-500 font-normal capitalize">{selectedTalle}</span>
            </label>
            <button 
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-[11px] text-accent font-bold uppercase flex items-center gap-1 hover:underline hover:text-primary transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              Guía de talles
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.talles && product.talles.length > 0 ? (
              product.talles.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTalle(t)}
                  className={`min-w-[3rem] h-10 px-3 flex items-center justify-center font-bold text-sm rounded-md transition-all border-2 ${
                    selectedTalle === t
                      ? "border-accent bg-accent/10 text-primary shadow-sm ring-1 ring-accent/50"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                  }`}
                >
                  {t}
                </button>
              ))
            ) : (
              <span className="h-10 px-4 flex items-center justify-center font-bold text-sm rounded-md border-2 border-accent bg-accent/10 text-primary cursor-default">
                Único
              </span>
            )}
          </div>
        </div>

        {/* Colores */}
        <div>
          <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wider">
            Color: <span className="text-gray-500 font-normal capitalize">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colores && product.colores.length > 0 ? (
              product.colores.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-4 h-10 flex items-center justify-center font-bold text-sm rounded-md transition-all border-2 ${
                    selectedColor === c
                      ? "border-accent bg-accent/10 text-primary shadow-sm ring-1 ring-accent/50"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                  }`}
                >
                  {c}
                </button>
              ))
            ) : (
              <span className="h-10 px-4 flex items-center justify-center font-bold text-sm rounded-md border-2 border-accent bg-accent/10 text-primary cursor-default">
                Único
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-primary mb-2.5 uppercase tracking-wider">Cantidad</label>
          <div className="flex items-center border border-border rounded-lg inline-flex overflow-hidden">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="px-4 py-2.5 text-primary hover:bg-surface transition-colors font-bold"
            >
              −
            </button>
            <span className="w-14 text-center font-bold text-primary text-lg">{cantidad}</span>
            <button
              onClick={() => setCantidad(Math.min(product.stock, cantidad + 1))}
              className="px-4 py-2.5 text-primary hover:bg-surface transition-colors font-bold"
            >
              +
            </button>
          </div>
          {product.stock < 5 && product.stock > 0 && (
            <p className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              ¡Últimas {product.stock} unidades!
            </p>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-3 pt-5 border-t border-border">
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`flex-1 py-4 rounded-lg font-bold text-base text-center transition-all ${
              product.stock <= 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : agregado
                ? "bg-green-500 text-white shadow-lg scale-[1.02]"
                : "bg-primary text-white hover:bg-opacity-90 hover:shadow-md active:scale-[0.98]"
            }`}
          >
            {product.stock <= 0 ? "Sin Stock" : agregado ? "✓ ¡Agregado al carrito!" : "Agregar al Carrito"}
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite({
                id: product.id,
                slug: product.slug || "",
                nombre: product.nombre,
                categoria: product.categoria || "",
                precio_mayorista: product.precio_mayorista,
                precio_minorista: product.precio_minorista,
                imagen: product.fotos?.[0] || "",
                en_promo: product.en_promo,
                precio_minorista_promo: product.precio_minorista_promo,
                precio_mayorista_promo: product.precio_mayorista_promo
              });
            }}
            className={`w-14 shrink-0 flex items-center justify-center rounded-lg border-2 transition-all ${
              isFavorite(product.id)
                ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
                : "border-border text-gray-400 hover:border-red-500 hover:text-red-500"
            }`}
            aria-label="Toggle favorito"
          >
            <svg 
              className={`w-6 h-6 transition-colors ${isFavorite(product.id) ? 'fill-red-500' : 'fill-none'}`} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isFavorite(product.id) ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {agregado && (
          <Link
            href="/carrito"
            className="w-full py-3 rounded-lg font-bold text-sm text-center border-2 border-accent text-accent hover:bg-accent hover:text-primary transition-all"
          >
            Ver mi carrito →
          </Link>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-whatsapp text-white py-4 rounded-lg font-bold text-base hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 w-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)]"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.096-1.332-.116-.399-.129-1.071-.352-2.05-1.127-1.106-.878-1.722-2.087-1.917-2.359-.14-.195-.477-.6-.477-1.163 0-.583.273-.892.4-.103.11-.122.258-.142.35-.142.11 0 .204.004.298.006.115.006.27-.044.423.324.156.377.534 1.304.58 1.402.046.096.082.203.013.344-.069.143-.106.23-.21.353-.105.123-.224.272-.319.349-.107.086-.22.18-.101.385.118.204.526.87 1.134 1.41.785.698 1.439.914 1.644.914.205 0 .324.088.441-.044.116-.134.502-.584.636-.786.134-.202.268-.168.455-.098.188.07.118-.616 1.391-.685.187-.07.31-.105.356-.142.045-.038.045-.195-.098-.6z" />
          </svg>
          <span>Comprar por WhatsApp</span>
        </a>
      </div>
      {/* Modal de Guía de Talles */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
        category={product.categoria} 
      />
    </div>
  );
}
