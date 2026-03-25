import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductAddToCart } from '@/components/cart/ProductAddToCart';

const SUPABASE_URL = "https://guppnkrbifvmgrvzejyp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cHBua3JiaWZ2bWdydnplanlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODMzMjMsImV4cCI6MjA4OTk1OTMyM30.fXiAwfAyS1thLYHEZr_t2sd6iqrdN42ksk7Vq5u3B3I";

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
  return {...p, talles: JSON.parse(p.talles||"[]"), colores: JSON.parse(p.colores||"[]"), fotos: JSON.parse(p.fotos||"[]"), stock_por_talle: JSON.parse(p.stock_por_talle||"{}")};
}

// Metadata dinámica SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'No encontrado' };

  return {
    title: product.nombre,
    description: product.descripcion,
    openGraph: {
      title: product.nombre,
      description: product.descripcion,
      images: [product.fotos[0]],
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543515555123";
  // Generando enlace Whatsapp pre-llenado para este producto
  const msg = `Hola! Quiero consultar por el producto: ${product.nombre} (Cod: ${product.id}). Precio Mayorista: $${product.precio_mayorista}`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(msg)}`;

  return (
    <div className="bg-bg min-h-screen pb-20 pt-8">
      {/* JSON-LD Schema Crítico para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.nombre,
            image: product.fotos,
            description: product.descripcion,
            brand: { "@type": "Brand", name: "Imperio de la Moda" },
            offers: {
              "@type": "Offer",
              url: `https://imperiolamoda.com.ar/producto/${product.slug}`,
              priceCurrency: "ARS",
              price: product.precio_minorista,
              availability: product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "Imperio de la Moda" },
            },
          }),
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* GALERÍA */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {product.fotos && product.fotos.length > 0 ? (
                <Image 
                  src={product.fotos[0]} 
                  alt={product.nombre}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.fotos && product.fotos.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.fotos.slice(1, 5).map((foto: string, idx: number) => (
                  <div key={idx} className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-accent">
                    <Image src={foto} alt={`${product.nombre} ${idx+2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETALLES Y ACCIONES */}
          <div className="flex flex-col">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-primary mb-2">{product.nombre}</h1>
            <p className="text-gray-400 text-sm mb-6">Cod: #{product.id.substring(0,6).toUpperCase()}</p>
            
            <div className="flex flex-col gap-2 mb-8 bg-surface p-6 rounded-xl border border-border">
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold">Precio Mayorista</span>
                <span className="text-2xl font-bold text-whatsapp">${product.precio_mayorista.toLocaleString('es-AR')}</span>
              </div>
              <div className="w-full h-px bg-border my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Precio Minorista</span>
                <span className="text-xl font-bold text-gray-900">${product.precio_minorista.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">{product.descripcion}</p>

            {/* SELECCIÓN CLIENT-SIDE / PARA EL CARRITO */}
            <ProductAddToCart product={product} />

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-gray-600">
                <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <p>Disponible para retiro inmediato en sucursal Córdoba.</p>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <p>Pagos en efectivo cuentan con un 10% adicional de descuento sobre el total.</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
