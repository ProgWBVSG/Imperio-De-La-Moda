import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        stock: true,
        precio_minorista: true,
        precio_mayorista: true,
        oculto: true,
        categoria: true,
        fotos: true,
        creado_en: true,
        destacado: true,
        vistas: true
      }
    });

    const pedidos = await prisma.pedido.findMany({
      where: {
        estado: {
          not: "CANCELADO"
        }
      }
    });

    let valorStock = 0;
    productos.forEach(p => {
        valorStock += (p.stock * p.precio_mayorista);
    });

    const stats = {
      totalProductos: productos.filter(x => !x.oculto).length,
      sinStock: productos.filter(x => x.stock === 0).length,
      totalGeneral: productos.length,
      destacados: productos.filter(x => x.destacado).length,
      ingresosTotales: pedidos.reduce((acc, p) => acc + p.total, 0),
      pedidosTotales: pedidos.length,
      ticketPromedio: pedidos.length > 0 ? pedidos.reduce((acc, p) => acc + p.total, 0) / pedidos.length : 0
    };

    const stockBajo = productos
      .filter(x => x.stock >= 0 && x.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10);

    const ultimos = [...productos]
      .sort((a, b) => b.creado_en.getTime() - a.creado_en.getTime())
      .slice(0, 10);

    const topVistos = [...productos]
      .sort((a, b) => b.vistas - a.vistas)
      .slice(0, 5);

    // Calcular ventas por producto
    const productSales: Record<string, { id: string, nombre: string, cantidad: number, ingresos: number }> = {};
    
    // Inicializar todos los productos en 0 para saber cuáles no se vendieron nada
    productos.forEach(p => {
      productSales[p.id] = { id: p.id, nombre: p.nombre, cantidad: 0, ingresos: 0 };
    });

    pedidos.forEach(p => {
      try {
        const items = JSON.parse(p.items);
        items.forEach((item: any) => {
          // Buscamos si el item coincide con algun nombre (ya que los items del pedido guardan nombre)
          const prod = productos.find(x => x.nombre === item.nombre);
          if (prod) {
            productSales[prod.id].cantidad += item.cantidad;
            productSales[prod.id].ingresos += (item.precio * item.cantidad);
          }
        });
      } catch (e) {}
    });

    const todosLosProductos = Object.values(productSales);
    
    const topVendidos = [...todosLosProductos]
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
      .filter(p => p.cantidad > 0);

    const menosVendidos = [...todosLosProductos]
      .sort((a, b) => a.cantidad - b.cantidad)
      .slice(0, 5);

    // Array completo para la tabla de rendimiento individual
    const rendimientoProductos = productos.map(p => {
      const sales = productSales[p.id];
      return {
        id: p.id,
        nombre: p.nombre,
        fotos: p.fotos,
        categoria: p.categoria,
        precio: p.precio_minorista,
        stock: p.stock,
        vistas: p.vistas,
        ventas: sales ? sales.cantidad : 0,
        ingresos: sales ? sales.ingresos : 0
      };
    }).sort((a, b) => b.vistas - a.vistas); // Ordenar por más vistos por defecto

    // Ventas por fecha (últimos 30 días o todo el historial si es chico)
    const ventasPorFecha: Record<string, number> = {};
    pedidos.forEach(p => {
      const fecha = p.creado_en.toISOString().split('T')[0];
      ventasPorFecha[fecha] = (ventasPorFecha[fecha] || 0) + p.total;
    });

    const graficoVentas = Object.entries(ventasPorFecha)
      .map(([fecha, total]) => ({ fecha, total }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    return NextResponse.json({ 
        stats, 
        stockBajo, 
        ultimos,
        topVistos,
        topVendidos,
        menosVendidos,
        graficoVentas,
        valorStock,
        rendimientoProductos
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
