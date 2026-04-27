"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Definimos la interfaz base
export interface Product {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  precio_mayorista: number;
  precio_minorista: number;
  descripcion: string;
  talles: string[];
  colores: string[];
  fotos: string[];
  stock: number;
  oculto: boolean;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [precioMax, setPrecioMax] = useState(30000);
  const [order, setOrder] = useState("nuevo");

  useEffect(() => {
    // Fetch inicial de todos los productos
    fetch('/api/productos')
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Productos API returned non-array payload", data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando productos", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Filtrado reactivo en el cliente
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filtro texto
    if (search.length > 2) {
      result = result.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));
    }
    
    // Filtro categoría
    if (categoria !== "todas") {
      result = result.filter(p => p.categoria === categoria);
    }
    
    // Filtro precio (basado en minorista por defecto)
    result = result.filter(p => p.precio_minorista <= precioMax);
    
    // Ordenamiento
    if (order === "menor_precio") result.sort((a, b) => a.precio_minorista - b.precio_minorista);
    if (order === "mayor_precio") result.sort((a, b) => b.precio_minorista - a.precio_minorista);
    
    return result;
  }, [products, search, categoria, precioMax, order]);

  return (
    <div className="bg-bg min-h-screen pb-20">
      {/* Header Catálogo */}
      <section className="bg-primary text-white py-12 px-4 text-center">
        <h1 className="font-display text-4xl font-bold mb-4">Catálogo Completo</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Filtrá por precio, talle o categoría. Recordá que comprando por mayor accedés a descuentos de hasta el 40%.</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* PANEL DE FILTROS LATERAL */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Buscar</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ej: Campera Puffer" 
                className="w-full pl-10 pr-4 py-2 border border-border rounded-radius-base focus:ring-1 focus:ring-accent outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Categoría</label>
            <div className="space-y-2">
              {['todas', 'mujer', 'hombre', 'ninos', 'accesorios'].map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="categoria" 
                    value={cat} 
                    checked={categoria === cat}
                    onChange={() => setCategoria(cat)}
                    className="text-accent focus:ring-accent"
                  />
                  <span className="capitalize text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Precio Máximo: ${precioMax.toLocaleString('es-AR')}</label>
            <input 
              type="range" 
              min="2000" 
              max="50000" 
              step="1000"
              value={precioMax}
              onChange={e => setPrecioMax(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$2.000</span>
              <span>$50.000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Ordenar por</label>
            <select 
              value={order}
              onChange={e => setOrder(e.target.value)}
              className="w-full p-2 border border-border rounded-radius-base focus:ring-1 focus:ring-accent outline-none bg-white"
            >
              <option value="nuevo">Más nuevos</option>
              <option value="menor_precio">Menor Precio</option>
              <option value="mayor_precio">Mayor Precio</option>
            </select>
          </div>
        </aside>

        {/* GRILLA DE PRODUCTOS */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-primary">Resultados ({filteredProducts.length})</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 md:h-80 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="font-bold text-lg text-primary mb-2">No encontramos productos</h3>
              <p className="text-gray-500">Probá ajustando los filtros o realizando otra búsqueda.</p>
              <button 
                onClick={() => {setSearch(''); setCategoria('todas'); setPrecioMax(50000);}}
                className="mt-6 text-accent font-bold hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <Link href={`/producto/${product.slug}`} key={product.id} className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                    {product.fotos && product.fotos[0] && (
                      <Image 
                        src={product.fotos[0]} 
                        alt={product.nombre} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        loading="lazy"
                      />
                    )}
                    {product.stock < 5 && product.stock > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Últimos {product.stock}</span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full uppercase">Agotado</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-gray-400 capitalize mb-1">{product.categoria}</span>
                    <h3 className="font-bold text-primary line-clamp-2 leading-tight mb-2 group-hover:text-accent transition-colors">{product.nombre}</h3>
                    
                    <div className="mt-auto space-y-1">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-whatsapp bg-whatsapp/10 px-1.5 py-0.5 rounded">Mayorista</span>
                        <span className="font-bold text-whatsapp">${product.precio_mayorista.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-gray-500">Minorista</span>
                        <span className="font-bold text-gray-900">${product.precio_minorista.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
