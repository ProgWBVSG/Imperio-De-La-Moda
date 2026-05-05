# DIRECTIVA: IMPORTACION_EXCEL_PRODUCTOS_SOP

> **ID:** 2026-05-04-IMPORT-EXCEL
> **Script Asociado:** `scripts/importador_excel_productos.py`
> **Última Actualización:** 2026-05-04
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Analizar una base de datos de stock en formato Excel (.xlsx o .csv) proporcionada por el usuario, procesarla, limpiar los datos, calcular métricas (ej. slug, stock total) y hacer el volcado/actualización (Upsert) de todos los productos en la base de datos Supabase/PostgreSQL de la tienda web.
- **Criterio de Éxito:** Todos los productos válidos del Excel existen en la tabla `Producto` con sus campos (precio, categorías, talles, stock) correctamente parseados como JSON strings (cuando aplique) y sincronizados sin arrojar errores de base de datos.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Argumentos Requeridos:**
  - `--file`: `string` - Ruta absoluta o relativa al archivo Excel/CSV.
- **Variables de Entorno (.env):**
  - `NEXT_PUBLIC_SUPABASE_URL`: URL base de Supabase.
  - `SUPABASE_SERVICE_ROLE_KEY` (o `SUPABASE_ANON_KEY` con permisos RLS configurados temporalmente, aunque es ideal usar un JWT administrativo si es posible, o hacer el insert saltando RLS a través de una API).
  - Como alternativa más sólida en este proyecto de Prisma: usar directamente la API REST del proyecto web (`POST /api/admin/productos`) para asegurar consistencia, pasando la key de admin.
- **Archivos Fuente:**
  - Archivo local `.xlsx` con las columnas obligatorias: `nombre`, `categoria`, `precio_minorista`, `precio_mayorista`. Columnas opcionales: `codigo_interno`, `talles`, `colores`, `stock_por_talle`, `descripcion`.

### Salidas (Outputs)
- **Artefactos Generados:**
  - `.tmp/import_log.json`: Archivo con el resumen de productos creados, actualizados y errores de fila.
- **Retorno de Consola:** Resumen detallado en la terminal con conteo de éxito y fallos.

## 3. Flujo Lógico (Algoritmo)

1. **Inicialización y Validación:**
   - Cargar variables de entorno del archivo `.env` en la raíz.
   - Verificar la existencia del archivo Excel suministrado por argumento.
2. **Lectura y Normalización (Pandas):**
   - Leer el Excel con `pandas`.
   - Limpiar nombres de columnas (pasar a minúsculas, remover espacios).
   - Filtrar filas vacías o sin nombre de producto.
3. **Transformación de Datos:**
   - **Slug:** Generar slug único a partir del `nombre` (remover tildes, minúsculas, espacios por guiones).
   - **JSON Strings:** Convertir las columnas de `talles` (ej. "S, M, L") en un string JSON válido `["S", "M", "L"]`.
   - **Manejo de Stock:** Calcular `stock` total si se proporciona `stock_por_talle`, de lo contrario usar valor por defecto `0`.
   - **Fallback:** Asignar valores por defecto a booleanos (`oculto=False`, `destacado=False`).
4. **Sincronización con la Web (Upsert):**
   - Iterar sobre el DataFrame.
   - Por cada producto, hacer un HTTP POST/PUT a la API interna del sistema (`/api/admin/productos` o directo a Supabase REST API) incluyendo autenticación.
   - Si el producto (slug) ya existe, actualizar sus datos. Si no, crearlo.
5. **Persistencia de Log:**
   - Guardar el resultado de la operación en la carpeta `.tmp/`.

## 4. Herramientas y Librerías permitidas
- **Librerías Python:** `pandas`, `requests`, `python-dotenv`, `openpyxl`.
- **APIs Externas:** Supabase REST API (via `requests`) o la propia API del framework Next.js.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Límites de Tipos:** Prisma requiere que `talles`, `colores`, `stock_por_talle`, `fotos` se envíen estrictamente como **JSON strings** y no como arrays puros.
- **Sanitización del Slug:** Si dos productos generan el mismo slug, la DB lanzará error de Unique Constraint. El script debe añadir un sufijo aleatorio si detecta colisión.
- **RLS (Seguridad):** La tabla Producto tiene RLS activo. Para insertar desde Python, o bien usamos una Service Role Key, o bien le pegamos al backend propio en `/api/admin/productos` donde no hay RLS, pero la ruta web exige una sesión de NextAuth. La solución más determinista es atacar directo a la Supabase REST API usando una Service Role Key (la cual deberemos añadir al `.env` si no está), o usar `psycopg2` directo con `DATABASE_URL`.

## 6. Historial de Aprendizaje
*Aún sin errores detectados (Fase de Diseño).*

## 7. Ejemplos de Uso
```bash
python scripts/importador_excel_productos.py --file "C:/ruta/al/inventario.xlsx"
```
