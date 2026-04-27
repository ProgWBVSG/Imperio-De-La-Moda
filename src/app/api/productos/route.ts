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


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit");
  const isDestacado = searchParams.get("destacado") === "true";
  try {
    let fetchUrl = `${SUPABASE_URL}/rest/v1/Producto?oculto=eq.false&order=creado_en.desc`;
    if (isDestacado) fetchUrl += `&destacado=eq.true`;
    if (limit) fetchUrl += `&limit=${limit}`;

    const res = await fetch(fetchUrl, { headers: getHeaders() });
    if (!res.ok) {
        throw new Error("Supabase fetch failed");
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error("Payload is not an array");
    }
    return NextResponse.json(data.map((p: any) => ({...p, talles: JSON.parse(p.talles||"[]"), colores: JSON.parse(p.colores||"[]"), fotos: JSON.parse(p.fotos||"[]"), stock_por_talle: JSON.parse(p.stock_por_talle||"{}")})));
  } catch (err) {
    console.error("API Productos Exception", err);
    return NextResponse.json([], { status: 500 });
  }
}
