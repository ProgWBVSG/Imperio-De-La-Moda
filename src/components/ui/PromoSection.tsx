"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface PromoProduct {
  id: string;
  slug: string;
  nombre: string;
  fotos: string[];
  precio_minorista: number;
  precio_mayorista: number;
  precio_minorista_promo?: number;
  precio_mayorista_promo?: number;
  promo_porcentaje?: number;
  en_promo?: boolean;
}

interface PromoData {
  id: string;
  nombre: string;
  descripcion: string;
  porcentaje_descuento: number;
  fecha_fin: string;
}

export default function PromoSection() {
  const [promo, setPromo] = useState<PromoData | null>(null);
  const [products, setProducts] = useState<PromoProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch active promos
    fetch("/api/promos")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPromo(data[0]);
        }
      })
      .catch(() => {});

    // Fetch products in promo
    fetch("/api/productos?promo=true&limit=8")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.filter((p: PromoProduct) => p.en_promo));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Countdown timer
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!promo?.fecha_fin) return;
    const tick = () => {
      const diff = new Date(promo.fecha_fin).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("¡Finalizada!");
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [promo?.fecha_fin]);

  // No render if no promo or no products
  if (!loading && (!promo || products.length === 0)) return null;
  if (loading) return null; // No skeleton para no romper el layout

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #2d0a0a 50%, #1a0505 100%)' }}>
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-[10%] w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-[15%] w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <ScrollReveal direction="scale">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Oferta por tiempo limitado
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
              🔥 {promo?.nombre || "Promos Activas"}
            </h2>
            {promo?.descripcion && (
              <p className="text-gray-400 max-w-xl mx-auto mb-4">{promo.descripcion}</p>
            )}
            
            {/* Countdown */}
            {countdown && (
              <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl px-6 py-3 mt-2">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-mono font-bold text-lg tracking-wider">{countdown}</span>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {products.slice(0, 8).map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 80} direction="up">
              <Link href={`/producto/${product.slug}`} className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-red-500/40 transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                {/* Badge descuento */}
                <div className="absolute top-2 right-2 z-20 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow-lg">
                  -{product.promo_porcentaje}%
                </div>

                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  {product.fotos?.[0] && (
                    <Image
                      src={product.fotos[0]}
                      alt={product.nombre}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="p-3">
                  <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-red-400 transition-colors">{product.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-gray-500 text-xs line-through">${product.precio_minorista.toLocaleString('es-AR')}</span>
                    <span className="text-red-400 font-bold text-lg">${(product.precio_minorista_promo || product.precio_minorista).toLocaleString('es-AR')}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal>
          <div className="text-center">
            <Link
              href="/catalogo?categoria=promos"
              onClick={() => {}}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            >
              Ver todas las promos
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
