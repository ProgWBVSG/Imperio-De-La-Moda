import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * Verifica que la request venga de un admin autenticado.
 * Retorna null si está autenticado, o un NextResponse 401 si no.
 * 
 * Uso:
 *   const authError = await requireAdmin();
 *   if (authError) return authError;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado. Iniciá sesión como administrador." },
      { status: 401 }
    );
  }
  return null;
}
