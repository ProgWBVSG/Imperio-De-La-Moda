import { NextResponse } from "next/server";

const SUPABASE_URL = "https://guppnkrbifvmgrvzejyp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cHBua3JiaWZ2bWdydnplanlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODMzMjMsImV4cCI6MjA4OTk1OTMyM30.fXiAwfAyS1thLYHEZr_t2sd6iqrdN42ksk7Vq5u3B3I";

const getHeaders = () => ({
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await req.json();

    const payload = {
        autor: body.autor,
        texto: body.texto,
        origen: body.origen,
        visible: body.visible
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Testimonio?id=eq.${resolvedParams.id}`, { 
        method: "PATCH", 
        headers: getHeaders(), 
        body: JSON.stringify(payload) 
    });
    
    if (!res.ok) throw new Error("Update failed");
    const [t] = await res.json();
    return NextResponse.json(t);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Testimonio?id=eq.${resolvedParams.id}`, { 
        method: "DELETE", 
        headers: getHeaders() 
    });
    
    if (!res.ok) throw new Error("Delete failed");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
