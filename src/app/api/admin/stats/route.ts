import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/stats — Estadísticas del dashboard
export async function GET() {
  try {
    const totalProductos = await prisma.producto.count({ where: { oculto: false } });
    const sinStock = await prisma.producto.count({ where: { stock: 0 } });
    const totalGeneral = await prisma.producto.count();
    const destacados = await prisma.producto.count({ where: { destacado: true } });

    // Productos con stock bajo (menos de 3 unidades)
    const stockBajo = await prisma.producto.findMany({
      where: { stock: { gt: 0, lte: 3 } },
      select: { id: true, nombre: true, stock: true },
    });

    // Últimos 5 productos
    const ultimos = await prisma.producto.findMany({
      orderBy: { creado_en: "desc" },
      take: 5,
      select: {
        id: true, nombre: true, categoria: true, 
        precio_minorista: true, precio_mayorista: true,
        stock: true, oculto: true, fotos: true, creado_en: true,
      },
    });

    const ultimosParsed = ultimos.map(p => ({
      ...p,
      fotos: JSON.parse(p.fotos),
    }));

    return NextResponse.json({
      stats: {
        totalProductos,
        sinStock,
        totalGeneral,
        destacados,
      },
      stockBajo,
      ultimos: ultimosParsed,
    });
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
