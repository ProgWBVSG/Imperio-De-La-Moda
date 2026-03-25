import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

const SUPABASE_URL = "https://guppnkrbifvmgrvzejyp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cHBua3JiaWZ2bWdydnplanlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODMzMjMsImV4cCI6MjA4OTk1OTMyM30.fXiAwfAyS1thLYHEZr_t2sd6iqrdN42ksk7Vq5u3B3I";

const getHeaders = () => ({
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
});

export async function GET() {
  try {
    // Traer todos en Admin
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Testimonio?order=creado_en.desc`, { 
        headers: getHeaders(),
        cache: 'no-store'
    });
    if (!res.ok) throw new Error("Fetch testimonios failed");
    return NextResponse.json(await res.json());
  } catch (error) {
    return NextResponse.json({ error: "Error listando testimonios" }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const body = await request.json();
      
      const payload = {
          id: randomUUID(),
          autor: body.autor || "Cliente Anónimo",
          texto: body.texto || "",
          origen: body.origen || "Web",
          visible: body.visible !== false, // default true
      };
  
      const iRes = await fetch(`${SUPABASE_URL}/rest/v1/Testimonio`, { 
          method: "POST", 
          headers: getHeaders(), 
          body: JSON.stringify(payload) 
      });
      
      if (!iRes.ok) throw new Error("Insert failed");
      const [inserted] = await iRes.json();
  
      return NextResponse.json(inserted, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Error al crear testimonio" }, { status: 500 });
    }
  }
