"use client";

import { useState } from "react";
import { useCart, CartItem } from "@/context/CartContext";
import Link from "next/link";

interface ProductProps {
  product: {
    id: string;
    nombre: string;
    precio_mayorista: number;
    precio_minorista: number;
    talles: string[];
    colores: string[];
    fotos: string[];
    stock: number;
  };
}

export function ProductAddToCart({ product }: ProductProps) {
  const { agregarItem, generarMensajeProducto } = useCart();

  const [selectedTalle, setSelectedTalle] = useState(product.talles[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colores[0] || "");
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

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
      imagen: product.fotos[0] || "",
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
  });

  return (
    <div className="bg-white border border-border p-6 rounded-xl shadow-sm space-y-6 mb-8">
      {/* Selectores */}
      <div className="space-y-5">
        {product.talles.length > 0 && (
          <div>
            <label className="block text-sm font-bold text-primary mb-2.5 uppercase tracking-wider">
              Talle
              <span className="ml-2 text-accent font-normal normal-case tracking-normal">— {selectedTalle || "Elegí uno"}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.talles.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTalle(t)}
                  className={`min-w-[3rem] h-11 px-3 flex items-center justify-center font-bold text-sm border rounded-lg transition-all ${
                    selectedTalle === t
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border text-primary hover:border-accent hover:text-accent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colores.length > 0 && (
          <div>
            <label className="block text-sm font-bold text-primary mb-2.5 uppercase tracking-wider">
              Color
              <span className="ml-2 text-accent font-normal normal-case tracking-normal">— {selectedColor || "Elegí uno"}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colores.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-4 py-2.5 font-bold text-sm border rounded-lg transition-all ${
                    selectedColor === c
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border text-primary hover:border-accent hover:text-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

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
        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className={`w-full py-4 rounded-lg font-bold text-base text-center transition-all ${
            product.stock <= 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : agregado
              ? "bg-green-500 text-white shadow-lg scale-[1.02]"
              : "bg-primary text-white hover:bg-opacity-90 hover:shadow-md active:scale-[0.98]"
          }`}
        >
          {product.stock <= 0 ? "Sin Stock" : agregado ? "✓ ¡Agregado al carrito!" : "Agregar al Carrito"}
        </button>

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
    </div>
  );
}
