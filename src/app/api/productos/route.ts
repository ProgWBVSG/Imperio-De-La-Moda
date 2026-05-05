import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit");
  const isDestacado = searchParams.get("destacado") === "true";
  const isPromo = searchParams.get("promo") === "true";

  try {
    let fetchUrl = `${SUPABASE_URL}/rest/v1/Producto?oculto=eq.false&order=creado_en.desc`;
    if (isDestacado) fetchUrl += `&destacado=eq.true`;
    if (isPromo) fetchUrl += `&promo_id=not.is.null`;
    if (limit) fetchUrl += `&limit=${limit}`;

    const res = await fetch(fetchUrl, { headers: getSupabaseHeaders() });
    if (!res.ok) {
        throw new Error("Supabase fetch failed");
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error("Payload is not an array");
    }

    // Fetch active promos to enrich product data
    const now = new Date().toISOString();
    let promosMap: Record<string, { nombre: string; porcentaje_descuento: number }> = {};
    try {
      const promosRes = await fetch(
        `${SUPABASE_URL}/rest/v1/Promocion?activa=eq.true&fecha_inicio=lte.${now}&fecha_fin=gte.${now}`,
        { headers: getSupabaseHeaders() }
      );
      if (promosRes.ok) {
        const promosData = await promosRes.json();
        for (const pr of promosData) {
          promosMap[pr.id] = { nombre: pr.nombre, porcentaje_descuento: pr.porcentaje_descuento };
        }
      }
    } catch {
      // silently continue without promo data
    }

    return NextResponse.json(data.map((p: any) => {
      const base = {
        ...p,
        talles: JSON.parse(p.talles||"[]"),
        colores: JSON.parse(p.colores||"[]"),
        fotos: JSON.parse(p.fotos||"[]"),
        stock_por_talle: JSON.parse(p.stock_por_talle||"{}"),
        productos_relacionados: JSON.parse(p.productos_relacionados||"[]"),
      };

      // Enrich with promo info
      if (p.promo_id && promosMap[p.promo_id]) {
        const promo = promosMap[p.promo_id];
        const descuento = promo.porcentaje_descuento / 100;
        base.en_promo = true;
        base.promo_nombre = promo.nombre;
        base.promo_porcentaje = promo.porcentaje_descuento;
        base.precio_minorista_promo = Math.round(p.precio_minorista * (1 - descuento));
        base.precio_mayorista_promo = Math.round(p.precio_mayorista * (1 - descuento));
      } else {
        base.en_promo = false;
      }

      return base;
    }));
  } catch (err) {
    console.error("API Productos Exception", err);
    return NextResponse.json([], { status: 500 });
  }
}
