import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET — Promos activas (público)
export async function GET() {
  try {
    const now = new Date().toISOString();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/Promocion?activa=eq.true&fecha_inicio=lte.${now}&fecha_fin=gte.${now}&order=creado_en.desc`,
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
    console.error("Error fetching active promos:", error);
    return NextResponse.json([], { status: 500 });
  }
}
