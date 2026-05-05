import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q") || "";
  const estado = searchParams.get("estado") || "";
  
  try {
    const whereClause: any = {};
    if (search) {
      whereClause.nombre = { contains: search, mode: "insensitive" };
    }
    if (estado === "activos") whereClause.oculto = false;
    else if (estado === "ocultos") whereClause.oculto = true;
    else if (estado === "sin-stock") whereClause.stock = 0;

    const productos = await prisma.producto.findMany({
      where: whereClause,
      orderBy: { creado_en: 'desc' }
    });

    return NextResponse.json(productos.map((p) => ({
        ...p, 
        talles: JSON.parse(p.talles||"[]"), 
        colores: JSON.parse(p.colores||"[]"), 
        fotos: JSON.parse(p.fotos||"[]"), 
        stock_por_talle: JSON.parse(p.stock_por_talle||"{}"),
        productos_relacionados: JSON.parse(p.productos_relacionados||"[]")
    })));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al listar productos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    let slug = body.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    // check unique
    const existing = await prisma.producto.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const stockPorTalle = body.stock_por_talle || {};
    const stockTotal = Object.values(stockPorTalle).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);

    const payload = {
        id: randomUUID(),
        slug,
        nombre: body.nombre, 
        categoria: body.categoria,
        precio_mayorista: parseInt(body.precio_mayorista) || 0,
        precio_minorista: parseInt(body.precio_minorista) || 0,
        descripcion: body.descripcion || "",
        codigo_interno: body.codigo_interno || "",
        talles: JSON.stringify(body.talles || []),
        colores: JSON.stringify(body.colores || []),
        stock_por_talle: JSON.stringify(stockPorTalle),
        fotos: JSON.stringify(body.fotos || []),
        productos_relacionados: JSON.stringify(body.productos_relacionados || []),
        stock: stockTotal,
        oculto: body.oculto ?? false,
        destacado: body.destacado ?? false,
        novedad: body.novedad ?? true,
    };

    const inserted = await prisma.producto.create({ data: payload });

    return NextResponse.json({ 
        ...inserted, 
        talles: JSON.parse(inserted.talles||"[]"), 
        colores: JSON.parse(inserted.colores||"[]"), 
        fotos: JSON.parse(inserted.fotos||"[]"), 
        stock_por_talle: JSON.parse(inserted.stock_por_talle||"{}"),
        productos_relacionados: JSON.parse(inserted.productos_relacionados||"[]")
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
