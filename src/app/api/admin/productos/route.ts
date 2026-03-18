import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/productos — Listar todos (incluyendo ocultos)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q") || "";
  const estado = searchParams.get("estado") || "";

  try {
    const where: any = {};
    
    if (search) {
      where.nombre = { contains: search };
    }
    
    if (estado === "activos") where.oculto = false;
    else if (estado === "ocultos") where.oculto = true;
    else if (estado === "sin-stock") where.stock = 0;

    const productos = await prisma.producto.findMany({
      where,
      orderBy: { creado_en: "desc" },
    });

    // Parse JSON fields
    const parsed = productos.map(p => ({
      ...p,
      talles: JSON.parse(p.talles),
      colores: JSON.parse(p.colores),
      fotos: JSON.parse(p.fotos),
      stock_por_talle: JSON.parse(p.stock_por_talle),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error listando productos:", error);
    return NextResponse.json({ error: "Error al listar productos" }, { status: 500 });
  }
}

// POST /api/admin/productos — Crear producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generar slug desde nombre
    let slug = body.nombre
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    // Verificar slug único
    const existing = await prisma.producto.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    // Calcular stock total
    const stockPorTalle = body.stock_por_talle || {};
    const stockTotal = Object.values(stockPorTalle).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);

    const producto = await prisma.producto.create({
      data: {
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
        stock: stockTotal,
        oculto: body.oculto ?? false,
        destacado: body.destacado ?? false,
        novedad: body.novedad ?? true,
      },
    });

    return NextResponse.json({ ...producto, talles: JSON.parse(producto.talles), colores: JSON.parse(producto.colores), fotos: JSON.parse(producto.fotos), stock_por_talle: JSON.parse(producto.stock_por_talle) }, { status: 201 });
  } catch (error) {
    console.error("Error creando producto:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
