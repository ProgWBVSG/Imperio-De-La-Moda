import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductAddToCart } from '@/components/cart/ProductAddToCart';
import { ProductViewTracker } from '@/components/analytics/ProductViewTracker';
import ProductGallery from '@/components/ui/ProductGallery';

// API para buscar Data del producto directo de Supabase REST
async function getProduct(slug: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/Producto?or=(id.eq.${slug},slug.eq.${slug})`, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || !data.length) return null;
  const p = data[0];
  if (p.oculto) return null;
  return {...p, talles: JSON.parse(p.talles||"[]"), colores: JSON.parse(p.colores||"[]"), fotos: JSON.parse(p.fotos||"[]"), stock_por_talle: JSON.parse(p.stock_por_talle||"{}"), productos_relacionados: JSON.parse(p.productos_relacionados||"[]")};
}

// Metadata dinámica SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'No encontrado' };

  const categoryMap: Record<string, string> = {
    mujer: 'Ropa Mujer',
    hombre: 'Ropa Hombre',
    ninos: 'Ropa Niños',
    accesorios: 'Accesorios de Moda',
  };

  const catLabel = categoryMap[product.categoria] || product.categoria;

  return {
    title: `${product.nombre} | Comprar en Imperio de la Moda Córdoba`,
    description: `${product.descripcion || product.nombre}. Precio minorista: $${product.precio_minorista?.toLocaleString('es-AR')}. Precio mayorista: $${product.precio_mayorista?.toLocaleString('es-AR')}. Disponible en Imperio de la Moda, San Martín 382, Córdoba.`,
    keywords: [product.nombre, catLabel, `${catLabel} Córdoba`, 'ropa mayorista Córdoba', 'imperio de la moda'],
    alternates: { canonical: `https://imperiolamoda.com.ar/producto/${product.slug}` },
    openGraph: {
      title: `${product.nombre} — Imperio de la Moda`,
      description: product.descripcion,
      images: product.fotos?.[0] ? [{ url: product.fotos[0], alt: product.nombre }] : [],
      type: 'website',
    },
  };
}

// API para buscar Recomendaciones
async function getRecomendados(product: any) {
  let recomendados: any[] = [];
  
  // 1. Manuales
  const idsManuales = product.productos_relacionados || [];
  if (idsManuales.length > 0) {
    const idsString = idsManuales.map((id: string) => `"${id}"`).join(',');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Producto?id=in.(${idsString})&oculto=eq.false`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      recomendados = data;
    }
  }

  // 2. Algorítmicos (Completar hasta 4)
  if (recomendados.length < 4) {
    const limit = 4 - recomendados.length;
    const existingIds = [product.id, ...recomendados.map(r => r.id)];
    const idFilter = existingIds.map(id => `id.neq.${id}`).join(',');
    
    let fetchUrl = `${SUPABASE_URL}/rest/v1/Producto?categoria=eq.${product.categoria}&oculto=eq.false&stock=gt.0&order=vistas.desc&limit=${limit}`;
    if (idFilter) fetchUrl += `&and=(${idFilter})`;

    const res = await fetch(fetchUrl, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      recomendados = [...recomendados, ...data];
    }
  }
  
  return recomendados.map((p: any) => ({
    ...p, 
    fotos: JSON.parse(p.fotos||"[]")
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

  const recomendados = await getRecomendados(product);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493512336795";
  const msg = `Hola! Quiero consultar por el producto: ${product.nombre} (Cod: ${product.id}). Precio Mayorista: $${product.precio_mayorista}`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(msg)}`;

  return (
    <div className="bg-bg min-h-screen pb-20 pt-8">
      <ProductViewTracker productId={product.id} />
      
      {/* JSON-LD Schema Crítico para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.nombre,
              image: product.fotos,
              description: product.descripcion,
              brand: { "@type": "Brand", name: "Imperio de la Moda" },
              category: product.categoria,
              offers: {
                "@type": "AggregateOffer",
                lowPrice: product.precio_mayorista,
                highPrice: product.precio_minorista,
                priceCurrency: "ARS",
                offerCount: 2,
                availability: product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
                seller: { "@type": "Organization", name: "Imperio de la Moda" },
                offers: [
                  {
                    "@type": "Offer",
                    name: "Precio Mayorista",
                    price: product.precio_mayorista,
                    priceCurrency: "ARS",
                    url: `https://imperiolamoda.com.ar/producto/${product.slug}`,
                  },
                  {
                    "@type": "Offer",
                    name: "Precio Minorista",
                    price: product.precio_minorista,
                    priceCurrency: "ARS",
                    url: `https://imperiolamoda.com.ar/producto/${product.slug}`,
                  },
                ],
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: "https://imperiolamoda.com.ar" },
                { "@type": "ListItem", position: 2, name: "Catálogo", item: "https://imperiolamoda.com.ar/catalogo" },
                { "@type": "ListItem", position: 3, name: product.categoria, item: `https://imperiolamoda.com.ar/catalogo?categoria=${product.categoria}` },
                { "@type": "ListItem", position: 4, name: product.nombre },
              ],
            },
          ]),
        }}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8 gap-2 uppercase tracking-wide">
          <Link href="/" className="hover:text-accent">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-accent">Catálogo</Link>
          <span>/</span>
          <Link href={`/catalogo/${product.categoria}`} className="hover:text-accent">{product.categoria}</Link>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-8 lg:gap-20 mb-20 max-w-6xl mx-auto">
          
          {/* GALERÍA (Sticky) */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-28 h-fit flex flex-col gap-6">
            <ProductGallery fotos={product.fotos} nombre={product.nombre} />
            
            {/* INFO EXTRA DEBAJO DE LA IMAGEN */}
            <div className="hidden lg:flex flex-col gap-4 mt-2">
              <div className="bg-surface border border-border p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  Envíos y Cambios
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Realizamos envíos a todo el país. Los cambios se aceptan dentro de los 15 días de recibida la compra, con etiqueta y sin uso.
                </p>
              </div>
              <div className="bg-surface border border-border p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Cuidados de la Prenda
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Lavar con agua fría. No usar lavandina. Plancha tibia. Para mayor durabilidad, lavar del revés.
                </p>
              </div>
            </div>
          </div>

          {/* DETALLES Y ACCIONES */}
          <div className="flex flex-col flex-1 max-w-md">
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary mb-2">{product.nombre}</h1>
            <p className="text-gray-400 text-sm mb-6">Cod: #{product.id.substring(0,6).toUpperCase()}</p>
            
            <div className="flex flex-col gap-2 mb-8 bg-surface p-5 rounded-xl border border-border">
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold text-sm">Precio Mayorista</span>
                <span className="text-2xl font-bold text-whatsapp">${product.precio_mayorista.toLocaleString('es-AR')}</span>
              </div>
              <div className="w-full h-px bg-border my-1"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Precio Minorista</span>
                <span className="text-lg font-bold text-gray-900">${product.precio_minorista.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-6">{product.descripcion}</p>

            {/* SELECCIÓN CLIENT-SIDE / PARA EL CARRITO */}
            <ProductAddToCart product={product} />

            {/* TRUST BADGES (GARANTÍAS) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <svg className="w-6 h-6 text-accent mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Calidad Premium</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <svg className="w-6 h-6 text-accent mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Mejores Precios</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <svg className="w-6 h-6 text-accent mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Pago Seguro</span>
              </div>
            </div>

            <div className="space-y-3 text-xs mt-6 opacity-70">
              <div className="flex items-start gap-2 text-gray-600">
                <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <p>Disponible para retiro inmediato en sucursal Córdoba.</p>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <p>Pagos en efectivo cuentan con un 10% adicional de descuento sobre el total.</p>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTOS RECOMENDADOS (CROSS-SELLING) */}
        {recomendados && recomendados.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-3xl font-bold text-primary mb-8">Completa tu look</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {recomendados.map(rec => (
                <Link href={`/producto/${rec.slug}`} key={rec.id} className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                    {rec.fotos && rec.fotos[0] ? (
                      <Image 
                        src={rec.fotos[0]} 
                        alt={rec.nombre} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    {rec.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">Agotado</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-gray-400 capitalize mb-1">{rec.categoria}</span>
                    <h3 className="font-bold text-primary text-sm line-clamp-2 leading-tight mb-3 group-hover:text-accent transition-colors">{rec.nombre}</h3>
                    
                    <div className="mt-auto space-y-1">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-whatsapp bg-whatsapp/10 px-1.5 py-0.5 rounded">Mayorista</span>
                        <span className="font-bold text-whatsapp text-sm">${rec.precio_mayorista.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] text-gray-500">Minorista</span>
                        <span className="font-bold text-gray-900 text-sm">${rec.precio_minorista.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
