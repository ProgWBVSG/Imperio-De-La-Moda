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


export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Producto?select=stock,precio_minorista,precio_mayorista`, { headers: getHeaders() });
    const p = await res.json();
    let valStr = 0;
    p.forEach((i:any) => valStr += (i.stock * i.precio_mayorista));
    return NextResponse.json({ totalProductos: p.length, valorStock: valStr, pedidosPendientes: 0, alertasStock: p.filter((x:any)=>x.stock < 5).length });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
