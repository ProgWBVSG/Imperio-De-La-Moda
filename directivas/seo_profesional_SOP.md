# SEO Profesional — Directiva SOP

## Objetivo
Posicionar a "Imperio de la Moda" por encima de Flaltia y Cumbres Mayorista en Google para búsquedas de ropa mayorista/minorista en Córdoba.

## Acciones Completadas
1. **sitemap.ts** → Genera `/sitemap.xml` dinámico con todas las URLs + todos los productos de Supabase
2. **robots.ts** → Genera `/robots.txt` con reglas de crawling y referencia al sitemap
3. **layout.tsx** → `metadataBase`, 30+ keywords long-tail, Schema ClothingStore enriquecido (geo, horarios, catálogo, redes)
4. **page.tsx (home)** → H1 con keywords ("Ropa Mayorista y Minorista en Córdoba"), sección FAQ con Schema FAQPage
5. **catalogo/layout.tsx** → Metadata dedicada para /catalogo
6. **producto/[slug]/page.tsx** → Metadata con precios, keywords dinámicos, AggregateOffer, BreadcrumbList Schema
7. **mayoristas/page.tsx** → Metadata agresiva para "ropa mayorista córdoba"
8. **nosotros/page.tsx** → Metadata con dirección y keywords locales

## Restricciones / Casos Borde
- **metadataBase es obligatorio** en Next.js para OG tags — si no está, sale warning y las imágenes OG no resuelven bien
- **No poner `noindex` en robots para /carrito** — los usuarios llegan pero no queremos que se indexe vacío
- **Schema FAQPage** debe tener el texto EXACTO tanto en el JSON-LD como en el HTML visible (Google verifica)
- **AggregateOffer** es mejor que Offer simple cuando hay precio mayorista y minorista
- **BreadcrumbList** mejora la presentación en SERP (Google muestra: Inicio > Catálogo > Mujer > Producto)

## Post-Deploy (manual)
1. Registrar en Google Search Console
2. Enviar sitemap
3. Verificar con Rich Results Test (https://search.google.com/test/rich-results)
4. Configurar Google My Business vinculado
