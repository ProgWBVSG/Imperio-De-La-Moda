# DIRECTIVA: IMPORTACION_EXCEL_PRODUCTOS_SOP

> **ID:** 2026-05-04-IMPORT-EXCEL
> **Script Asociado:** `scripts/importador_excel_productos.py`
> **Última Actualización:** 2026-05-04
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Analizar una base de datos de stock en formato Excel (.xlsx o .csv) subida directamente desde el panel web (Next.js), procesarla usando inteligencia de mapeo de columnas y hacer un Upsert en PostgreSQL usando Prisma `$transaction`.
- **Criterio de Éxito:** El usuario puede arrastrar un Excel en `/admin/stock`, y el sistema detecta los datos (perdonando errores en los nombres de columnas) insertando o actualizando todo instantáneamente.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Frontend:** Archivo `.xlsx` subido vía `<input type="file">` en React.
- **Backend (API):** `FormData` recibido en la ruta `POST /api/admin/importar`.

### Salidas (Outputs)
- **Frontend:** Toast Notifications ("Analizando IA...", "Sincronización exitosa").

## 3. Flujo Lógico (Algoritmo)

1. **Recepción del Archivo:** La API recibe el FormData y extrae el buffer.
2. **Lectura y Normalización (Librería `xlsx`):** Convierte el binario a un JSON Array de objetos.
3. **Mapeo Inteligente (IA):** En vez de buscar la columna estricta "precio_mayorista", busca variaciones ("costo", "mayorista", "x mayor"). Si encuentra el valor, lo asigna.
4. **Transformación:**
   - Slugs automáticos SEO.
   - Convertir diccionarios de stock (ej. `S:5, M:2`) a JSON strings requeridos por Prisma.
5. **Transacción Segura:** Usar `prisma.$transaction` con `upsert` para inyectar todo atómicamente.

## 4. Herramientas y Librerías permitidas
- **Frontend/Backend:** `Next.js 15 App Router` + `React`.
- **Lectura Excel:** Librería `xlsx`.
- **ORM:** `Prisma Client`.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Archivos Vacíos:** La API debe detenerse si el buffer pesa 0 bytes o si no hay filas detectadas tras el fuzzy matching.
- **Tiempos de Ejecución (Timeouts):** Si el Excel tiene más de 10.000 productos, el límite Serverless de Vercel (10s a 60s) podría matar el proceso. Prisma `$transaction` suele ser rapidísimo, pero hay que advertir al usuario de no subir archivos titánicos de un tirón.

## 6. Historial de Aprendizaje
- *2026-05-04*: Se cambió el enfoque local (Python/psycopg2) por un enfoque Web "Plug & Play" con Node.js (`xlsx`) a pedido del cliente para facilitar la usabilidad.

## 7. Ejemplos de Uso
El cliente interactúa únicamente haciendo click en el botón **"📄 Carga Masiva (Excel)"** dentro de `/admin/stock`.
