import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'ID de pedido no proporcionado' }, { status: 400 });
    }

    const { estado } = await req.json();

    if (!estado) {
      return NextResponse.json({ error: 'El nuevo estado es requerido' }, { status: 400 });
    }

    const pedidoActualizado = await prisma.pedido.update({
      where: { id },
      data: { estado }
    });

    return NextResponse.json(pedidoActualizado);
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    return NextResponse.json({ error: 'Error interno o pedido no encontrado' }, { status: 500 });
  }
}
