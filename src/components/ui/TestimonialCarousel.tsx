"use client";

import { useEffect, useRef, useState } from "react";

interface Testimonio {
  id: string;
  autor: string;
  texto: string;
  origen: string;
  visible: boolean;
  creado_en: string;
}

// Testimonios extra para garantizar que el track siempre se vea lleno
const FALLBACK_EXTRA: Omit<Testimonio, "visible" | "creado_en">[] = [
  { id: "x1", autor: "Daniela M.", texto: "Increible variedad y los precios son lo mejor. Compre para toda la familia y quedamos encantados.", origen: "Instagram" },
  { id: "x2", autor: "Carlos R.",  texto: "Compro por mayor desde hace 2 anos. Siempre puntuales y la calidad no defrauda.", origen: "WhatsApp" },
  { id: "x3", autor: "Sofia L.",   texto: "El local es hermoso y la atencion es de primera. Volvi tres veces el mismo mes.", origen: "Google Maps" },
  { id: "x4", autor: "Tomas A.",   texto: "La mejor relacion precio-calidad de Cordoba. Totalmente recomendado para reventa.", origen: "TikTok" },
  { id: "x5", autor: "Florencia B.", texto: "Me ayudaron a elegir y me fueron super honestos. Eso vale oro hoy en dia.", origen: "WhatsApp" },
  { id: "x6", autor: "Nicolas V.", texto: "Lleve pedido por mayor y fue todo perfecto. Entrega rapida y bien embalado.", origen: "Instagram" },
];

function StarRating() {
  return (
    <div className="flex gap-0.5 text-accent mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Partial<Testimonio> & { autor: string; texto: string; origen: string } }) {
  return (
    <div className="flex-none w-[320px] md:w-[360px] mx-3">
      <div className="bg-white rounded-2xl p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] border border-gray-100 h-full flex flex-col relative">
        {/* Comilla decorativa */}
        <span className="absolute -top-3 left-6 text-accent/20 text-5xl font-serif leading-none select-none">"</span>
        <StarRating />
        <p className="text-gray-700 italic text-sm leading-relaxed flex-grow mb-5">"{t.texto}"</p>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-accent font-bold text-sm shrink-0">
            {t.autor.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-primary text-sm">{t.autor}</p>
            <p className="text-xs text-gray-400">Via {t.origen}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialCarousel({ testimonios }: { testimonios: Testimonio[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef  = useRef<number | null>(null);
  const posRef   = useRef(0);
  const pauseRef = useRef(false);

  // Combinar testimonios de la API con los extra, luego duplicar para el loop infinito
  const base = [
    ...testimonios.filter((t) => t.visible).slice(0, 20),
    ...FALLBACK_EXTRA,
  ];
  // Triplicamos para que el bucle nunca muestre el borde
  const items = [...base, ...base, ...base];

  const SPEED = 0.6; // px por frame

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const singleWidth = track.scrollWidth / 3;

    const animate = () => {
      if (!pauseRef.current) {
        posRef.current += SPEED;
        // Cuando recorrimos un tercio exacto, reseteamos sin salto visible
        if (posRef.current >= singleWidth) {
          posRef.current -= singleWidth;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [items.length]);

  return (
    <div
      className="overflow-hidden w-full cursor-grab active:cursor-grabbing"
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
        {items.map((t, i) => (
          <TestimonialCard key={`${t.id ?? t.autor}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
