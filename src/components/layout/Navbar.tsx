"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import GlobalSearch from '@/components/ui/GlobalSearch';

const CATALOG_CATEGORIES = [
  { label: "Todo el catalogo", href: "/catalogo",                      icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
  { label: "🔥 Promos",       href: "/catalogo?categoria=promos",      icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" },
  { label: "Mujer",            href: "/catalogo?categoria=mujer",      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Hombre",           href: "/catalogo?categoria=hombre",     icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Ninos",            href: "/catalogo?categoria=ninos",      icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Accesorios",       href: "/catalogo?categoria=accesorios", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
];

function MobileCatalogMenu({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-bg hover:text-accent font-medium py-2"
      >
        <span>Catalogo</span>
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pl-4 flex flex-col space-y-1 pb-2 border-l border-accent/30 ml-1 mt-1">
          {CATALOG_CATEGORIES.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="text-sm text-gray-300 hover:text-accent py-1.5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cantidadTotal } = useCart();
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-primary/95 backdrop-blur-md shadow-lg py-2" : "bg-primary py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="relative w-20 h-10 md:w-24 md:h-12">
              <Image src="/logo-imperio.png" alt="Imperio de la Moda" fill className="object-contain filter drop-shadow-md group-hover:scale-105 transition-transform" priority />
            </div>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center space-x-8 font-bold text-sm tracking-wide text-bg">
            <div className="relative group">
              <Link href="/catalogo" className="hover:text-accent transition-colors flex items-center gap-1 py-4">
                Catálogo
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              
              <div className="absolute top-full left-0 bg-white shadow-xl rounded-xl border border-gray-100 py-3 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0">
                <Link href="/catalogo/remeras" className="block px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Remeras y Musculosas</Link>
                <Link href="/catalogo/pantalones" className="block px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Pantalones y Jeans</Link>
                <Link href="/catalogo/abrigos" className="block px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Buzos y Camperas</Link>
                <Link href="/catalogo/promos" className="block px-5 py-2.5 text-red-600 font-bold hover:bg-red-50 transition-colors">🔥 Promociones</Link>
              </div>
            </div>
            
            <Link href="/mayoristas" className="hover:text-accent transition-colors">Mayoristas</Link>
            <Link href="/nosotros"   className="hover:text-accent transition-colors">Nosotros</Link>
          </div>

          {/* ACCIONES DESKTOP */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-bg hover:text-accent transition-colors flex items-center justify-center"
              aria-label="Buscar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <Link href="/favoritos" className="relative p-2 text-bg hover:text-accent transition-colors flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link href="/carrito" className="relative p-2 text-bg hover:text-accent transition-colors flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cantidadTotal > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {cantidadTotal}
                </span>
              )}
            </Link>
            <a
              href="https://api.whatsapp.com/send?phone=5493512336795"
              target="_blank" rel="noopener noreferrer"
              className="bg-accent text-primary px-5 py-2 rounded-radius-base text-sm font-bold hover:bg-opacity-90 transition-colors"
            >
              Contacto Directo
            </a>
          </div>

          {/* MENU MOBILE TOGGLE */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-bg hover:text-accent transition-colors"
              aria-label="Buscar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/favoritos" className="relative p-2 text-bg hover:text-accent transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link href="/carrito" className="relative p-2 text-bg hover:text-accent transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cantidadTotal > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {cantidadTotal}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-bg focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-primary pb-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-1 pt-4">
            <MobileCatalogMenu onClose={() => setIsOpen(false)} />
            <Link href="/mayoristas" onClick={() => setIsOpen(false)} className="text-bg hover:text-accent font-medium py-2">Mayoristas</Link>
            <Link href="/nosotros"   onClick={() => setIsOpen(false)} className="text-bg hover:text-accent font-medium py-2">Nosotros</Link>
            <a
              href="https://api.whatsapp.com/send?phone=5493512336795"
              target="_blank" rel="noopener noreferrer"
              className="bg-accent text-primary px-4 py-3 rounded-radius-base text-center font-bold mt-4"
            >
              Contacto Directo
            </a>
          </div>
        </div>
      )}
      {/* Global Search Overlay */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
    </>
  );
}
