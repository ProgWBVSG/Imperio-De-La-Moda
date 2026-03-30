import os
import subprocess

def main():
    route_path = os.path.join("src", "app", "api", "admin", "stats", "route.ts")
    
    new_content = """import { NextResponse } from "next/server";

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
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Producto?select=id,nombre,stock,precio_minorista,precio_mayorista,oculto,categoria,fotos,creado_en,destacado`, { 
      headers: getHeaders(),
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
"""
    if os.path.exists(route_path):
        with open(route_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ Se actualizó el endpoint {route_path}")
    else:
        print(f"⚠️ No se encontró {route_path}")
        return

    # Opcionalmente hacemos commit, podemos hacerlo por terminal
    try:
        subprocess.run(["git", "add", route_path], check=True)
        subprocess.run(["git", "commit", "-m", "fix: refactorizar respuesta de /api/admin/stats"], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("✅ Git push exitoso.")
    except Exception as e:
        print(f"⚠️ Error al commitear: {e}")

if __name__ == "__main__":
    main()
