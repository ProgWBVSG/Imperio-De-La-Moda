import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cliente, items, total, esMayorista, whatsappUrl } = body;

    // Validación básica
    if (!cliente || !items || typeof total !== 'number') {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Crear el registro del pedido en estado PENDIENTE automáticamente
    const pedido = await prisma.pedido.create({
      data: {
        cliente,
        items: JSON.stringify(items),
        total,
        esMayorista: esMayorista ?? false,
        whatsappUrl: whatsappUrl ?? "",
      },
    });

    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    return NextResponse.json({ error: 'Error interno del servidor al crear el pedido' }, { status: 500 });
  }
}
