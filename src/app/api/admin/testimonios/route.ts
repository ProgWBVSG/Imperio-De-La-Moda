import { requireAdmin } from "@/lib/auth";
import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    // Traer todos en Admin
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Testimonio?order=creado_en.desc`, { 
        headers: getSupabaseHeaders(),
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
          headers: getSupabaseHeaders(), 
          body: JSON.stringify(payload) 
      });
      
      if (!iRes.ok) throw new Error("Insert failed");
      const [inserted] = await iRes.json();
  
      return NextResponse.json(inserted, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Error al crear testimonio" }, { status: 500 });
    }
  }
