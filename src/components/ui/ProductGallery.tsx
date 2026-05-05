"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  fotos: string[];
  nombre: string;
}

export default function ProductGallery({ fotos, nombre }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (!fotos || fotos.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center text-gray-300">
        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Imagen principal con zoom */}
      <div
        className="relative aspect-[3/4] w-full bg-gray-100 rounded-2xl overflow-hidden shadow-sm cursor-zoom-in group"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={fotos[selectedIndex]}
          alt={`${nombre} - Foto ${selectedIndex + 1}`}
          fill
          className={`object-cover transition-transform duration-300 ${zoomed ? "scale-[2]" : "scale-100"}`}
          style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
          priority={selectedIndex === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Flechas de navegación */}
        {fotos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(prev => prev === 0 ? fotos.length - 1 : prev - 1); setZoomed(false); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(prev => prev === fotos.length - 1 ? 0 : prev + 1); setZoomed(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Contador de fotos */}
        {fotos.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm z-10">
            {selectedIndex + 1} / {fotos.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {fotos.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {fotos.slice(0, 8).map((foto, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden transition-all ${
                selectedIndex === idx
                  ? "ring-2 ring-accent ring-offset-2 shadow-md"
                  : "border-2 border-transparent hover:border-accent/50 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={foto} alt={`${nombre} ${idx + 1}`} fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
