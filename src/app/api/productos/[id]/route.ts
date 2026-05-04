import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Producto?or=(id.eq.${id},slug.eq.${id})`, { headers: getSupabaseHeaders() });
    const data = await res.json();
    if (!data.length) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    const p = data[0];
    if (p.oculto) return NextResponse.json({ error: "Product is disabled" }, { status: 403 });
    return NextResponse.json({...p, talles: JSON.parse(p.talles||"[]"), colores: JSON.parse(p.colores||"[]"), fotos: JSON.parse(p.fotos||"[]"), stock_por_talle: JSON.parse(p.stock_por_talle||"{}")});
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
