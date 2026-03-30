import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Buscar todos los pedidos, ordenados por fecha de creación (los más recientes primero)
    const pedidos = await prisma.pedido.findMany({
      orderBy: {
        creado_en: 'desc'
      }
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
