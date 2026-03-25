import { NextResponse } from "next/server";

const SUPABASE_URL = "https://guppnkrbifvmgrvzejyp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cHBua3JiaWZ2bWdydnplanlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODMzMjMsImV4cCI6MjA4OTk1OTMyM30.fXiAwfAyS1thLYHEZr_t2sd6iqrdN42ksk7Vq5u3B3I";

const getHeaders = () => ({
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
});

import { randomUUID } from "crypto";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q") || "";
  const estado = searchParams.get("estado") || "";
  try {
    let fetchUrl = `${SUPABASE_URL}/rest/v1/Producto?select=*&order=creado_en.desc`;
    if (search) fetchUrl += `&nombre=ilike.*${encodeURIComponent(search)}*`;
    if (estado === "activos") fetchUrl += `&oculto=eq.false`;
    else if (estado === "ocultos") fetchUrl += `&oculto=eq.true`;
    else if (estado === "sin-stock") fetchUrl += `&stock=eq.0`;

    const res = await fetch(fetchUrl, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data.map((p: any) => ({...p, talles: JSON.parse(p.talles||"[]"), colores: JSON.parse(p.colores||"[]"), fotos: JSON.parse(p.fotos||"[]"), stock_por_talle: JSON.parse(p.stock_por_talle||"{}")})));
  } catch (error) {
    return NextResponse.json({ error: "Error al listar productos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let slug = body.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    // ver unique
    const uRes = await fetch(`${SUPABASE_URL}/rest/v1/Producto?slug=eq.${slug}`, { headers: getHeaders() });
    const uData = await uRes.json();
    if (uData.length > 0) slug = `${slug}-${Date.now()}`;

    const stockPorTalle = body.stock_por_talle || {};
    const stockTotal = Object.values(stockPorTalle).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);

    const payload = {
        id: randomUUID(),
        slug,
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
        oculto: body.oculto ?? false,
        destacado: body.destacado ?? false,
        novedad: body.novedad ?? true,
        actualizado_en: new Date().toISOString()
    };

    const iRes = await fetch(`${SUPABASE_URL}/rest/v1/Producto`, { method: "POST", headers: getHeaders(), body: JSON.stringify(payload) });
    if (!iRes.ok) throw new Error("Insert failed");
    const [inserted] = await iRes.json();

    return NextResponse.json({ ...inserted, talles: JSON.parse(inserted.talles||"[]"), colores: JSON.parse(inserted.colores||"[]"), fotos: JSON.parse(inserted.fotos||"[]"), stock_por_talle: JSON.parse(inserted.stock_por_talle||"{}") }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
