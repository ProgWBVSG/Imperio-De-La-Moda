"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cantidadTotal } = useCart();

  return (
    <nav className="bg-primary text-bg sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          <div className="flex items-center">
            <Link href="/" className="font-display text-2xl font-bold tracking-wider text-accent">
              IMPERIO
            </Link>
          </div>
          
          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/catalogo" className="hover:text-accent transition-colors">Catálogo</Link>
            <Link href="/mayoristas" className="hover:text-accent transition-colors">Mayoristas</Link>

            <Link href="/nosotros" className="hover:text-accent transition-colors">Nosotros</Link>
          </div>
          
          {/* ACCIONES DESKTOP */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/carrito" 
              className="relative p-2 text-bg hover:text-accent transition-colors flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cantidadTotal > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {cantidadTotal}
                </span>
              )}
            </Link>
            <a href="https://api.whatsapp.com/send?phone=543515555123" target="_blank" rel="noopener noreferrer" className="bg-accent text-primary px-5 py-2 rounded-radius-base text-sm font-bold hover:bg-opacity-90 transition-colors">
              Contacto Directo
            </a>
          </div>
          
          {/* MENU MOBILE TOGGLE */}
          <div className="md:hidden flex items-center space-x-4">
            <Link 
              href="/carrito" 
              className="relative p-2 text-bg hover:text-accent transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cantidadTotal > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {cantidadTotal}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-bg focus:outline-none"
            >
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

      {/* MENU MOBILE DROP DOWN */}
      {isOpen && (
        <div className="md:hidden bg-primary pb-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-4 pt-4">
            <Link href="/catalogo" onClick={() => setIsOpen(false)} className="text-bg hover:text-accent font-medium">Catálogo</Link>
            <Link href="/mayoristas" onClick={() => setIsOpen(false)} className="text-bg hover:text-accent font-medium">Mayoristas</Link>

            <Link href="/nosotros" onClick={() => setIsOpen(false)} className="text-bg hover:text-accent font-medium">Nosotros</Link>
            <a href="https://api.whatsapp.com/send?phone=543515555123" target="_blank" rel="noopener noreferrer" className="bg-accent text-primary px-4 py-3 rounded-radius-base text-center font-bold mt-4">
              Contacto Directo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
