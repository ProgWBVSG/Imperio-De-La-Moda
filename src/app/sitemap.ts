import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://imperiolamoda.com.ar';

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mayoristas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/carrito`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ];

  // Páginas dinámicas: todos los productos
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/Producto?oculto=eq.false&select=slug,creado_en`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 3600 }, // revalidar cada hora
      }
    );
    if (res.ok) {
      const products = await res.json();
      productPages = products.map((p: { slug: string; creado_en: string }) => ({
        url: `${baseUrl}/producto/${p.slug}`,
        lastModified: new Date(p.creado_en),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Si falla Supabase, devolvemos solo las estáticas
  }

  return [...staticPages, ...productPages];
}
