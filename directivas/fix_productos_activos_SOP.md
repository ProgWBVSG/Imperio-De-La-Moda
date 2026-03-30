# Directiva: Corrección de Contador de Productos y Estadísticas en Dashboard

## 1. Identidad y Propósito
El panel de administrador (`/admin`) debe mostrar en tiempo real la cantidad de productos activos, sin stock, totales y los más recientes. 
Fallo actual: El endpoint de la base de datos no está devolviendo la estructura JSON requerida. 

## 2. Entradas
- Archivo a modificar: `src/app/api/admin/stats/route.ts`

## 3. Lógica y Pasos a Seguir
1. Modificar la query de `fetch` a la API REST de Supabase en `route.ts`. 
2. En lugar de hacer `select=stock,precio_minorista,precio_mayorista`, debemos traer todos los campos necesarios para los contadores y listados: `select=id,nombre,stock,precio_minorista,precio_mayorista,oculto,categoria,fotos,creado_en,destacado`.
3. Filtrar los productos para construir el objeto `stats`:
   - `totalProductos`: Cantidad de ítems donde `oculto === false`.
   - `sinStock`: Cantidad de ítems donde `stock === 0`.
   - `totalGeneral`: Cantidad total de productos obtenidos.
   - `destacados`: Cantidad de ítems donde `destacado === true`.
4. Construir arreglo `stockBajo` filtrando productos con `stock <= 3`.
5. Construir arreglo `ultimos` ordenando por `creado_en` y tomando los últimos 10.
6. Retornar `NextResponse.json({ stats, stockBajo, ultimos })`.

## 4. Restricciones y Casos Borde
- Debemos asegurarnos de no usar el ORM de Prisma aquí para evitar los problemas de IPv6/IPv4 y limit timeouts explicados en el `imperio_de_la_moda_SOP.md`. Mantenemos el `fetch` directo a la API de Supabase.
- Configurar `cache: 'no-store'` en el fetch interno de Next.js si es necesario, o depender del endpoint al ser siempre hit en el lado cliente (el Dashboard es "use client").
- Ejecutar test corriendo el script que reescribirá el archivo y validando compilación/estado en git.
