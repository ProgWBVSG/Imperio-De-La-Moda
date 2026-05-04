/**
 * Configuración centralizada de Supabase.
 * NUNCA hardcodear credenciales en archivos individuales.
 * Todas las rutas API deben importar desde aquí.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("[Supabase] ⚠️ Variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_ANON_KEY no configuradas.");
}

export const getSupabaseHeaders = () => ({
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
});
