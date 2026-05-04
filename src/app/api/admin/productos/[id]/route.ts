import { requireAdmin } from "@/lib/auth";
import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Producto?id=eq.${id}`, { headers: getSupabaseHeaders() });
    const data = await res.json();
    if (!data.length) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    const p = data[0];
    return NextResponse.json({...p, talles: JSON.parse(p.talles||"[]"), colores: JSON.parse(p.colores||"[]"), fotos: JSON.parse(p.fotos||"[]"), stock_por_talle: JSON.parse(p.stock_por_talle||"{}")});
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    const body = await req.json();
    const stockPorTalle = body.stock_por_talle || {};
    const stockTotal = Object.values(stockPorTalle).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);

    const payload = {
        nombre: body.nombre, 
        categoria: body.categoria,
        precio_mayorista: parseInt(body.precio_mayorista) || 0,
        precio_minorista: parseInt(body.precio_minorista) || 0,
        descripcion: body.descripcion || "",
        codigo_interno: body.codigo_interno || "",
        talles: JSON.stringify(body.talles || []),
        colores: JSON.stringify(body.colores || []),
        stock_por_talle: JSON.stringify(stockPorTalle),
        fotos: JSON.stringify(body.fotos || []),
        stock: stockTotal,
        oculto: body.oculto,
        destacado: body.destacado,
        novedad: body.novedad,
        actualizado_en: new Date().toISOString()
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Producto?id=eq.${id}`, { method: "PATCH", headers: getSupabaseHeaders(), body: JSON.stringify(payload) });
    const [p] = await res.json();
    return NextResponse.json({...p, talles: JSON.parse(p.talles||"[]"), colores: JSON.parse(p.colores||"[]"), fotos: JSON.parse(p.fotos||"[]"), stock_por_talle: JSON.parse(p.stock_por_talle||"{}")});
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    await fetch(`${SUPABASE_URL}/rest/v1/Producto?id=eq.${id}`, { method: "DELETE", headers: getSupabaseHeaders() });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
