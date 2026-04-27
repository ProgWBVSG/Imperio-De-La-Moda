import { NextResponse } from "next/server";

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
    // Solo carga testimonios visibles y ordenalos por los mas recientes
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Testimonio?visible=eq.true&order=creado_en.desc`, { 
        headers: getHeaders(),
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
