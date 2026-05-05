import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    
    const p = await prisma.producto.findUnique({ where: { id } });
    if (!p) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    
    // Calcular ventas e ingresos buscando pedidos
    const pedidos = await prisma.pedido.findMany({ select: { items: true } });
    let totalVentas = 0;
    let totalIngresos = 0;

    pedidos.forEach(pedido => {
      try {
        const items = JSON.parse(pedido.items);
        items.forEach((item: any) => {
          if (item.nombre === p.nombre) {
            totalVentas += item.cantidad;
            totalIngresos += (item.precio * item.cantidad);
          }
        });
      } catch (e) {}
    });

    return NextResponse.json({
        ...p, 
        talles: JSON.parse(p.talles||"[]"), 
        colores: JSON.parse(p.colores||"[]"), 
        fotos: JSON.parse(p.fotos||"[]"), 
        stock_por_talle: JSON.parse(p.stock_por_talle||"{}"),
        productos_relacionados: JSON.parse(p.productos_relacionados||"[]"),
        ventas_totales: totalVentas,
        ingresos_totales: totalIngresos
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    const body = await req.json();
    const stockPorTalle = body.stock_por_talle || {};
    const stockTotal = Object.values(stockPorTalle).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);

    const payload = {
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
        oculto: body.oculto,
        destacado: body.destacado,
        novedad: body.novedad,
    };

    const p = await prisma.producto.update({
        where: { id },
        data: payload
    });

    return NextResponse.json({
        ...p, 
        talles: JSON.parse(p.talles||"[]"), 
        colores: JSON.parse(p.colores||"[]"), 
        fotos: JSON.parse(p.fotos||"[]"), 
        stock_por_talle: JSON.parse(p.stock_por_talle||"{}"),
        productos_relacionados: JSON.parse(p.productos_relacionados||"[]")
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    await prisma.producto.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
