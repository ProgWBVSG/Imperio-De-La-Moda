# Directiva: Corrección de "a.map is not a function" (Client-side Exceptions)

## 1. Identidad y Propósito
El propósito de esta directiva es mantener un registro y los pasos para solucionar problemas comunes donde el frontend asume que un "fetch" REST devuelve un array, e intenta usar `.map()`, pero la API falló y devolvió HTML O un objeto de error JSON.

Fallo detectado: `Application error: a client-side exception has occurred`.
Razón subyacente: El componente `TestimonialsSection.tsx` obtiene datos de `/api/testimonios`. Si esa API falla y responde 500 o un string fallido, el cliente rompe toda la React tree aplicando `data.map()` en algo que no es un array.

## 2. Entradas
- Archivo Front-End a modificar: `src/components/ui/TestimonialsSection.tsx`
- Archivo de Backend opcional: `src/app/api/testimonios/route.ts` (retornar un array vacío si hay un except)

## 3. Lógica y Pasos a Seguir
1. Modificar el bloque de `fetch()` en la carga de componentes de Cliente para no asumir arrays automáticamente.
2. Hacer comprobación de `Array.isArray(data)` antes de aplicar los sets de estado.
3. Asegurarse de adjuntar bloques `.catch()` a todas las promesas del lado cliente para manejar fallos de red sin desestabilizar la UI.
4. En la API (lado del servidor `route.ts`), ante un fallo `try/catch`, retornar silenciosamente un array vacío `[]` con error estatus u objeto estructurado antes que un `String` y fallar por completo (O al menos, que el cliente esté preparado).

## 4. Restricciones y Casos Borde
- Nota: Nunca iterar datos de fetch usando `.map()` sin antes comprobar con resiliencia lógica que es un array o aplicar un default data (`[]`), porque causa un "unhandled error" que detiene todo el ciclo de hidratación en Next.js. Esto causó previamente que la página web Imperio de la Moda.vercel.app completa cayera con una excepción fatal. En su lugar, hacer una validación del JSON recibido en componentes cliente.
