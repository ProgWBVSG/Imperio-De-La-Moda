"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

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
  const pathname = usePathname();
  const { cantidadTotal } = useCart();

  return (
    <nav className="bg-primary text-bg sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo-imperio.png" alt="Imperio de la Moda" width={140} height={50} className="h-12 w-auto object-contain" priority />
            </Link>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">

            {/* Catalogo con dropdown */}
            <div className="relative group">
              <Link
                href="/catalogo"
                className="hover:text-accent transition-colors flex items-center gap-1"
              >
                Catalogo
                <svg
                  className="w-3 h-3 mt-px transition-transform duration-200 group-hover:rotate-180"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Dropdown panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-56">
                  <div className="px-4 py-2.5 bg-accent/5 border-b border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Colecciones</span>
                  </div>
                  {CATALOG_CATEGORIES.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-accent/5 hover:text-accent transition-colors border-b border-gray-100 last:border-0"
                    >
                      <svg className="w-4 h-4 text-accent/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/mayoristas" className="hover:text-accent transition-colors">Mayoristas</Link>
            <Link href="/nosotros"   className="hover:text-accent transition-colors">Nosotros</Link>
          </div>

          {/* ACCIONES DESKTOP */}
          <div className="hidden md:flex items-center space-x-6">
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
    </nav>
  );
}
