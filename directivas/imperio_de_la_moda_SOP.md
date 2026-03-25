# Directiva - Imperio de la Moda (Desarrollo Web Next.js)

## 1. Identidad y Propósito
El objetivo es construir una plataforma e-commerce con **código puro** (Next.js 14+ con App Router, TypeScript, TailwindCSS), sin CMS (como WordPress/WooCommerce). Esto maximiza el SEO agresivamente en el ámbito local (Córdoba) y optimiza la velocidad. El modelo de ventas usa WhatsApp como embudo y punto único de conversión.

## 2. Pila Tecnológica
- **Frontend / Backend:** Next.js (App Router), Node.js, TypeScript.
- **Estilos:** Tailwind CSS con CSS variables para theaming fácil.
- **Base de Datos:** PostgreSQL (mediante Prisma ORM) probablemente alojada en Supabase.
- **Hosting Final:** Vercel.

## 3. Restricciones y Casos Borde (El Bucle Central)
- **Responsive:** Mobile-first absoluto. La vista de 375px se diseña y maqueta primero; todo lo demás escala desde ahí. Mínimo 16px font-size para el body en mobile.
- **Manejo de Imágenes:** Todo debe subirse y servirse obligatoriamente utilizando el componente `next/image` con formatos recomendados WebP/AVIF para evitar penalizaciones en el tiempo de LCP.
- **SEO Intransable:**
  - El catálogo se debe renderizar en servidor para asegurar indexación (SSR o SSG).
  - Schema JSON-LD es obligatorio: `Product` en producto individual y `LocalBusiness` en el `layout.tsx` de toda la aplicación.
- **Carrito de Compras:** Debe retener la información a pesar de recargas. Debe persistir en `localStorage` pero asegurando no romper la hidratación de React (Client-side usage).
- **Generador Checkout WhatsApp:**
  - La URL generada para abrir WhatsApp (`https://api.whatsapp.com/send...`) debe escapar correctamente saltos de líneas (`%0A`) e inputs de usuarios `encodeURIComponent()` para evitar links truncados.
- **Backend Admin:** Interfaz protegida. El dueño usará esto por su celular y la manipulación (precio rápido o stock rápido a 0 o toggle producto) no puede tomar más de 3 clics o interacciones.
- **Base de Datos / Prisma (CRÍTICO):** Este proyecto utiliza y está bloqueado a **Prisma versión 6.x**. **NO** ejecutar `npx prisma` porque puede instalar temporalmente Prisma 7.x, el cual rompe la validación del esquema (la propiedad `url` fue eliminada en Prisma 7) generando errores 500 silenciosos al intentar guardar productos (Error P1012). Usar siempre los scripts en package.json (ej: `npm run db:push`).
- **Arquitectura de Red Vercel vs Supabase (CRÍTICO):** Vercel Serverless opera con IPv4, mientras que los dominios directos de Supabase (`db.[ref].supabase.co`) son exclusivos para IPv6. A su vez, el PgBouncer de Supabase (pooler en `aws-0...`) puede fallar al resolver el Tenant ID. Para evitar errores de timeout severos (Error 500) en el Panel de Administrador, **TODAS las mutaciones de base de datos** deben hacerse consumiendo la **API REST nativa de Supabase sobre HTTPS**, puenteando el ORM Prisma por completo.

*Nota: Esta directiva se mantendrá viva y se actualizará si encontramos nuevas "trampas" o restricciones lógicas.*
