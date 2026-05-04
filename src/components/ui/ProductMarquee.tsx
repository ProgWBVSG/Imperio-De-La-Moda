"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  precio_mayorista: number;
  precio_minorista: number;
  fotos: string[];
}

function ProductCard({ product }: { product: Product }) {
  const foto = product.fotos?.[0];

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative flex-shrink-0 w-[220px] md:w-[260px] rounded-2xl overflow-hidden border border-white/10 hover:border-accent/60 transition-all duration-500 bg-white/5 backdrop-blur-sm"
    >
      {/* Imagen */}
      <div className="relative aspect-[3/4] w-full bg-black/30 overflow-hidden">
        {foto ? (
          <Image
            src={foto}
            alt={product.nombre}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="260px"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-[10px] uppercase tracking-[0.15em] text-accent/80 font-bold">
          {product.categoria}
        </span>
        <h4 className="text-white text-sm font-bold leading-tight mt-1 line-clamp-2 group-hover:text-accent transition-colors duration-300">
          {product.nombre}
        </h4>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-accent font-bold text-base">
            ${product.precio_minorista.toLocaleString("es-AR")}
          </span>
          <span className="text-white/40 text-[11px] line-through">
            ${Math.round(product.precio_minorista * 1.3).toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {/* Glow hover effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" 
        style={{ boxShadow: "inset 0 0 30px rgba(201,168,76,0.15)" }} 
      />
    </Link>
  );
}

function MarqueeRow({
  products,
  direction,
}: {
  products: Product[];
  direction: "left" | "right";
}) {
  // Duplicamos la lista para lograr el efecto infinito continuo
  const duplicated = [...products, ...products];

  return (
    <div className="overflow-hidden py-2">
      <div
        className={`marquee-track ${direction === "left" ? "marquee-left" : "marquee-right"}`}
      >
        {duplicated.map((product, i) => (
          <ProductCard key={`${product.id}-${i}`} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function ProductMarquee() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/productos?limit=20")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data: Product[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Si hay pocos productos, repetimos para llenar
          let pool = [...data];
          while (pool.length < 8) {
            pool = [...pool, ...data];
          }
          setProducts(pool);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando productos marquee", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="bg-primary py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-heading">
            <h2 className="!text-white">Lo Más Buscado</h2>
            <span className="decorative-line decorative-line-center"></span>
          </div>
          <div className="flex gap-5 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[260px] h-[380px] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  // Barajamos un poco las filas para que no sean idénticas
  const row1 = products;
  const row2 = [...products].reverse();
  const row3 = [...products.slice(Math.floor(products.length / 3)), ...products.slice(0, Math.floor(products.length / 3))];

  return (
    <section className="bg-primary py-20 overflow-hidden relative">
      {/* Background texture */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-primary to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-primary to-transparent pointer-events-none" />

      <div className="relative z-5">
        <div className="section-heading mb-12">
          <span className="fashion-tag mb-4 mx-auto !text-accent !border-accent/40">
            Tendencia actual
          </span>
          <h2 className="!text-white mt-4">Lo Más Buscado</h2>
          <span className="decorative-line decorative-line-center"></span>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto text-sm">
            Los productos que están marcando tendencia. Actualizamos nuestro catálogo cada semana.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <MarqueeRow products={row1} direction="left" />
          <MarqueeRow products={row2} direction="right" />
          <MarqueeRow products={row3} direction="left" />
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-radius-base font-bold text-lg hover:scale-105 transition-all shadow-[0_0_25px_rgba(201,168,76,0.35)]"
          >
            Ver catálogo completo
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
