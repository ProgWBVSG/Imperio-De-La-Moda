import { requireAdmin } from "@/lib/auth";
import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET — Lista todas las promos
export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/Promocion?select=*&order=creado_en.desc`,
      { headers: getSupabaseHeaders() }
    );
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    return NextResponse.json(
      data.map((p: any) => ({
        ...p,
        producto_ids: JSON.parse(p.producto_ids || "[]"),
      }))
    );
  } catch (error) {
    console.error("Error listing promos:", error);
    return NextResponse.json({ error: "Error al listar promos" }, { status: 500 });
  }
}

// POST — Crear nueva promo
export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const body = await request.json();

    const payload = {
      nombre: body.nombre,
      descripcion: body.descripcion || "",
      porcentaje_descuento: parseInt(body.porcentaje_descuento) || 10,
      fecha_inicio: body.fecha_inicio || new Date().toISOString(),
      fecha_fin: body.fecha_fin || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      activa: body.activa ?? true,
      banner_url: body.banner_url || "",
      producto_ids: JSON.stringify(body.producto_ids || []),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Promocion`, {
      method: "POST",
      headers: getSupabaseHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase insert error:", errText);
      throw new Error("Insert failed");
    }
    const [inserted] = await res.json();

    // Actualizar promo_id en los productos asociados
    const productoIds: string[] = body.producto_ids || [];
    if (productoIds.length > 0 && inserted.id) {
      for (const pid of productoIds) {
        await fetch(`${SUPABASE_URL}/rest/v1/Producto?id=eq.${pid}`, {
          method: "PATCH",
          headers: getSupabaseHeaders(),
          body: JSON.stringify({ promo_id: inserted.id }),
        });
      }
    }

    return NextResponse.json(
      { ...inserted, producto_ids: JSON.parse(inserted.producto_ids || "[]") },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating promo:", error);
    return NextResponse.json({ error: "Error al crear promo" }, { status: 500 });
  }
}
