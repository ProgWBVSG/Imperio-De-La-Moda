"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* MARCA */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-bold text-accent tracking-widest">IMPERIO</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Mayorista y minorista de indumentaria en Córdoba. Ropa de calidad a precios que te convienen.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com/imperiolamoda" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-all text-gray-400 hover:text-primary">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://tiktok.com/@imperiolamoda" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-all text-gray-400 hover:text-primary">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.91 2.87 2.87 0 012.88-2.86c.32 0 .63.05.93.13V9.05a6.36 6.36 0 00-.93-.07A6.36 6.36 0 003.13 15.3a6.35 6.35 0 0010.86 4.43v-7.56a8.19 8.19 0 005.59 2.2v-3.45a4.84 4.84 0 01-3.77-1.86V6.69h3.78z" /></svg>
              </a>
            </div>
          </div>
          
          {/* NAV RÁPIDA */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/catalogo" className="hover:text-accent transition-colors">Catálogo</Link></li>
              <li><Link href="/mayoristas" className="hover:text-accent transition-colors">Mayoristas</Link></li>
              <li><Link href="/nosotros" className="hover:text-accent transition-colors">Nosotros</Link></li>
            </ul>
          </div>
          
          {/* INFO */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Información</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                <span>San Martín 390, Córdoba</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>L-V 9–18 · S 9–13</span>
              </li>
            </ul>
          </div>
          
          {/* LEGAL */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/politica-privacidad" className="hover:text-accent transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-accent transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/arrepentimiento" className="hover:text-accent transition-colors">Botón de Arrepentimiento</Link></li>
            </ul>
            <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10 text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Data Fiscal</p>
              <div className="w-12 h-12 bg-white/10 rounded mx-auto flex items-center justify-center text-gray-500 text-xs">QR</div>
            </div>
          </div>
        </div>
        
        {/* BOTTOM */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Imperio de la Moda. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ en Córdoba, Argentina</p>
        </div>
      </div>
    </footer>
  );
}
