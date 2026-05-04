import { requireAdmin } from "@/lib/auth";
import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Producto?select=id,nombre,stock,precio_minorista,precio_mayorista,oculto,categoria,fotos,creado_en,destacado`, { 
      headers: getSupabaseHeaders(),
      cache: 'no-store'
    });
    
    if (!res.ok) {
        throw new Error("Error fetching from Supabase");
    }

    const p = await res.json();
    
    let valStr = 0;
    p.forEach((i: any) => {
        valStr += (i.stock * i.precio_mayorista);
    });

    const stats = {
      totalProductos: p.filter((x: any) => x.oculto === false).length,
      sinStock: p.filter((x: any) => x.stock === 0).length,
      totalGeneral: p.length,
      destacados: p.filter((x: any) => x.destacado === true).length
    };

    const stockBajo = p
      .filter((x: any) => x.stock >= 0 && x.stock <= 5)
      .map((x: any) => ({ id: x.id, nombre: x.nombre, stock: x.stock }))
      .sort((a: any, b: any) => a.stock - b.stock)
      .slice(0, 10);

    const ultimos = [...p]
      .sort((a: any, b: any) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())
      .slice(0, 10);

    return NextResponse.json({ 
        stats, 
        stockBajo, 
        ultimos,
        valorStock: valStr 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
