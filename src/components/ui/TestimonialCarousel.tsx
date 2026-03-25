"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Testimonio {
  id: string;
  autor: string;
  texto: string;
  origen: string;
  visible: boolean;
  creado_en: string;
}

export default function TestimonialCarousel({ testimonios }: { testimonios: Testimonio[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  if (!testimonios || testimonios.length === 0) return null;

  return (
    <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
      <div className="flex -ml-4 py-4">
        {testimonios.map((t) => (
          <div
            key={t.id}
            className="flex-none min-w-0 pl-4 w-full md:w-1/2 lg:w-1/3"
          >
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-border relative h-full flex flex-col justify-between hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
              <span className="absolute -top-4 left-6 text-accent/20 text-6xl font-display leading-none select-none">
                "
              </span>
              <div className="flex text-accent mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic mb-6 leading-relaxed text-sm flex-grow">
                "{t.texto}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-accent font-bold text-sm">
                  {t.autor.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-primary text-sm truncate max-w-[150px]">{t.autor}</p>
                  <p className="text-xs text-text-muted">Vía {t.origen}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
