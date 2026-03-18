import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/productos/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json({
      ...producto,
      talles: JSON.parse(producto.talles),
      colores: JSON.parse(producto.colores),
      fotos: JSON.parse(producto.fotos),
      stock_por_talle: JSON.parse(producto.stock_por_talle),
    });
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

// PUT /api/admin/productos/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    const stockPorTalle = body.stock_por_talle || {};
    const stockTotal = Object.values(stockPorTalle).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);

    const producto = await prisma.producto.update({
      where: { id },
      data: {
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
        novedad: body.novedad ?? false,
      },
    });

    return NextResponse.json({
      ...producto,
      talles: JSON.parse(producto.talles),
      colores: JSON.parse(producto.colores),
      fotos: JSON.parse(producto.fotos),
      stock_por_talle: JSON.parse(producto.stock_por_talle),
    });
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// DELETE /api/admin/productos/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.producto.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}

// PATCH /api/admin/productos/[id] — Actualización parcial (stock, toggle oculto, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const data: any = {};

    if (body.oculto !== undefined) data.oculto = body.oculto;
    if (body.destacado !== undefined) data.destacado = body.destacado;
    if (body.novedad !== undefined) data.novedad = body.novedad;
    
    if (body.stock_por_talle !== undefined) {
      data.stock_por_talle = JSON.stringify(body.stock_por_talle);
      data.stock = Object.values(body.stock_por_talle).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
    }

    const producto = await prisma.producto.update({ where: { id }, data });
    return NextResponse.json(producto);
  } catch (error) {
    console.error("Error parcheando producto:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
