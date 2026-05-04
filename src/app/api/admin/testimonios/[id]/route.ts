import { requireAdmin } from "@/lib/auth";
import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";

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
        headers: getSupabaseHeaders(), 
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
        headers: getSupabaseHeaders() 
    });
    
    if (!res.ok) throw new Error("Delete failed");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
