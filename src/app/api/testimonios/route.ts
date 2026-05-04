import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Solo carga testimonios visibles y ordenalos por los mas recientes
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Testimonio?visible=eq.true&order=creado_en.desc`, { 
        headers: getSupabaseHeaders(),
        // Next.js config para recargar en un lapso razonable si se quieren guardar o hacer ISR
        next: { revalidate: 60 } 
    });
    
    if (!res.ok) throw new Error("Fetch testimonios failed");
    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Testimonio API Exception", error);
    // Para simplificar y evitar fallos 100% devolvemos fallback array
    return NextResponse.json([], { status: 500 });
  }
}
