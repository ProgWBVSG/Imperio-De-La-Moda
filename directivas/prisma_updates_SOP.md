# SOP: Actualizaciones de Prisma y Base de Datos (Next.js Local)

## Objetivo
Establecer el procedimiento seguro y determinista para modificar el esquema de base de datos (`schema.prisma`) en un entorno de desarrollo local con Next.js corriendo sobre Windows, evitando bloqueos de archivos DLL y desincronización de clientes.

## Trampas Conocidas y Restricciones (CRÍTICO)

*   **Error EPERM (Locking de Windows):** Si se intenta ejecutar `npx prisma generate` o `npx prisma db push` mientras el servidor de desarrollo de Next.js (`npm run dev`) está activo, Windows bloqueará el archivo `query_engine-windows.dll.node`. 
*   **Consecuencia:** El cliente de Prisma local no se actualizará. Cualquier ruta de API que intente llamar al nuevo modelo devolverá un `Error 500: Cannot read properties of undefined (reading 'findFirst')`.
*   **Nota:** No intentar forzar la regeneración sin detener el servidor, ya que corrompe temporalmente el cliente cacheado de Next.js.

## Pasos de Ejecución (Orden Estricto)

1.  **Detener Procesos:** El usuario o el agente debe detener explícitamente el proceso de Node que corre el servidor (`Ctrl+C` en la terminal).
2.  **Modificar Esquema:** Añadir o alterar los modelos en `prisma/schema.prisma`.
3.  **Sincronizar BD:** Ejecutar `npx prisma db push` para subir los cambios a Supabase/PostgreSQL.
4.  **Regenerar Cliente:** Ejecutar `npx prisma generate` para crear las interfaces TypeScript correctas.
5.  **Reiniciar Servidor:** Ejecutar `npm run dev` para que Next.js levante el nuevo cliente limpio.

Este SOP debe ser consultado antes de proponer cualquier adición de modelos (como el gestor de tareas `AdminTask`).
