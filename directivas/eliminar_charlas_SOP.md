# Directiva: Eliminar Sección y Página de Charlas

## 1. Objetivo
Eliminar todas las referencias, páginas y secciones relacionadas con "Charlas" en el proyecto y subir los cambios a GitHub.

## 2. Entradas
- Archivos a modificar: `src/app/nosotros/page.tsx` (eliminar mención de charlas en el texto).
- Archivos a eliminar (ya eliminados del file system, pero pendientes en git): `src/app/charlas/page.tsx`, `src/app/admin/charlas/page.tsx`.
- Archivos modificados pendientes de commit: `src/components/admin/AdminSidebar.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Navbar.tsx`.

## 3. Lógica y Pasos a Seguir
1. Leer el archivo `src/app/nosotros/page.tsx`.
2. Buscar la cadena exacta `charlas y ` (dentro del texto descriptivo) y eliminarla, para que la oración siga teniendo sentido.
3. Guardar el archivo modificado.
4. Ejecutar comandos Git para:
   - `git add .` (para capturar las eliminaciones y modificaciones)
   - `git commit -m "feat: eliminar seccion y pagina de charlas"`
   - `git push origin main`

## 4. Restricciones y Casos Borde
- Asegurarse de que el reemplazo en el archivo `page.tsx` no rompa la estructura del componente de React.
- El script de Python debe manejar los comandos de git usando `subprocess`.
