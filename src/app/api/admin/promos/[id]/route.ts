import { requireAdmin } from "@/lib/auth";
import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET — Detalle de una promo
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Promocion?id=eq.${id}`, { headers: getSupabaseHeaders() });
    const data = await res.json();
    if (!data.length) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    const p = data[0];
    return NextResponse.json({ ...p, producto_ids: JSON.parse(p.producto_ids || "[]") });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

// PATCH — Editar promo
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    const body = await req.json();

    // Construir payload dinámico (solo campos enviados)
    const payload: Record<string, any> = {};
    if (body.nombre !== undefined) payload.nombre = body.nombre;
    if (body.descripcion !== undefined) payload.descripcion = body.descripcion;
    if (body.porcentaje_descuento !== undefined) payload.porcentaje_descuento = parseInt(body.porcentaje_descuento);
    if (body.fecha_inicio !== undefined) payload.fecha_inicio = body.fecha_inicio;
    if (body.fecha_fin !== undefined) payload.fecha_fin = body.fecha_fin;
    if (body.activa !== undefined) payload.activa = body.activa;
    if (body.banner_url !== undefined) payload.banner_url = body.banner_url;
    if (body.producto_ids !== undefined) payload.producto_ids = JSON.stringify(body.producto_ids);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Promocion?id=eq.${id}`, {
      method: "PATCH",
      headers: getSupabaseHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Update failed");
    const [updated] = await res.json();

    // Si se actualizaron los producto_ids, sincronizar promo_id en productos
    if (body.producto_ids !== undefined) {
      // Primero limpiar promo_id de productos que ya no están asociados
      await fetch(`${SUPABASE_URL}/rest/v1/Producto?promo_id=eq.${id}`, {
        method: "PATCH",
        headers: getSupabaseHeaders(),
        body: JSON.stringify({ promo_id: null }),
      });
      // Luego asignar promo_id a los nuevos productos
      const productoIds: string[] = body.producto_ids || [];
      for (const pid of productoIds) {
        await fetch(`${SUPABASE_URL}/rest/v1/Producto?id=eq.${pid}`, {
          method: "PATCH",
          headers: getSupabaseHeaders(),
          body: JSON.stringify({ promo_id: id }),
        });
      }
    }

    return NextResponse.json({ ...updated, producto_ids: JSON.parse(updated.producto_ids || "[]") });
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// DELETE — Eliminar promo
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    // Limpiar promo_id de productos asociados
    await fetch(`${SUPABASE_URL}/rest/v1/Producto?promo_id=eq.${id}`, {
      method: "PATCH",
      headers: getSupabaseHeaders(),
      body: JSON.stringify({ promo_id: null }),
    });
    // Eliminar la promo
    await fetch(`${SUPABASE_URL}/rest/v1/Promocion?id=eq.${id}`, {
      method: "DELETE",
      headers: getSupabaseHeaders(),
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
