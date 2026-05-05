"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  fotos: string[];
  categoria: string;
}

interface RowProps {
  products: Producto[];
  direction: "left" | "right";
  speed?: number;
}

function ProductCard({ producto }: { producto: Producto }) {
  const foto = producto.fotos?.[0] ?? null;

  return (
    <Link
      href={`/catalogo/${producto.id}`}
      className="flex-none w-[200px] mx-2.5 group"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        {/* Imagen */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-50">
          {foto ? (
            <>
              <Image
                src={foto}
                alt={producto.nombre}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${producto.fotos && producto.fotos.length > 1 ? 'group-hover:opacity-0' : ''}`}
                sizes="200px"
              />
              {producto.fotos && producto.fotos.length > 1 && (
                <Image 
                  src={producto.fotos[1]} 
                  alt={`${producto.nombre} - detalle`} 
                  fill 
                  className="object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  sizes="200px"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Badge de categoria */}
          {producto.categoria && (
            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
              {producto.categoria}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-sm font-semibold text-gray-800 truncate leading-snug">{producto.nombre}</p>
          <p className="text-accent font-black text-base mt-1">
            ${producto.precio.toLocaleString("es-AR")}
          </p>
        </div>
      </div>
    </Link>
  );
}

function TickerRow({ products, direction, speed = 0.5 }: RowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef   = useRef(0);
  const pauseRef = useRef(false);
  const animRef  = useRef<number | null>(null);

  // Triplicamos para que el bucle nunca muestre un borde
  const items = [...products, ...products, ...products];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    // Esperamos a que el DOM esté pintado para leer el ancho real
    const raf = requestAnimationFrame(() => {
      const singleWidth = track.scrollWidth / 3;

      // Posicion inicial: si va hacia la derecha arrancamos en el primer tercio
      if (direction === "right") posRef.current = singleWidth;

      const animate = () => {
        if (!pauseRef.current) {
          if (direction === "left") {
            posRef.current += speed;
            if (posRef.current >= singleWidth) posRef.current -= singleWidth;
          } else {
            posRef.current -= speed;
            if (posRef.current <= 0) posRef.current += singleWidth;
          }
          track.style.transform = `translateX(-${posRef.current}px)`;
        }
        animRef.current = requestAnimationFrame(animate);
      };

      animRef.current = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(raf);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [products.length, direction, speed]);

  if (products.length === 0) return null;

  return (
    <div
      className="overflow-hidden w-full py-2 cursor-grab active:cursor-grabbing"
      onMouseEnter={() => (pauseRef.current = true)}
      onMouseLeave={() => (pauseRef.current = false)}
      onTouchStart={() => (pauseRef.current = true)}
      onTouchEnd={() => (pauseRef.current = false)}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ width: "max-content" }}
      >
        {items.map((p, i) => (
          <ProductCard key={`${p.id}-${i}`} producto={p} />
        ))}
      </div>
    </div>
  );
}

export default function ProductTicker({ products }: { products: Producto[] }) {
  if (!products || products.length === 0) return null;

  // Dividimos los productos en 3 grupos. Si hay pocos, los repetimos en cada fila.
  const fill = (arr: Producto[], minLen = 8): Producto[] => {
    if (arr.length === 0) return [];
    let result = [...arr];
    while (result.length < minLen) result = [...result, ...arr];
    return result;
  };

  // Row 1: todos los productos (o el mismo repetido) — va hacia la izquierda
  // Row 2: desplazados — va hacia la derecha (efecto alternado)
  // Row 3: todos — va hacia la izquierda
  const row1 = fill(products);
  // Desplazamos la fila 2 para que no empiece exactamente igual
  const row2 = fill([...products.slice(Math.floor(products.length / 2)), ...products.slice(0, Math.floor(products.length / 2))]);
  const row3 = fill([...products].reverse());

  return (
    <div className="flex flex-col gap-4">
      <TickerRow products={row1} direction="left"  speed={0.45} />
      <TickerRow products={row2} direction="right" speed={0.55} />
      <TickerRow products={row3} direction="left"  speed={0.5}  />
    </div>
  );
}
