import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener la lista de leads (Para el admin)
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { creado_en: "desc" }
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener leads" }, { status: 500 });
  }
}

// Crear un nuevo lead (Desde el popup)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validar datos básicos
    if (!data.nombre || !data.email) {
      return NextResponse.json({ error: "Nombre y email son requeridos" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        nombre: data.nombre,
        email: data.email
      }
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    // Manejar error de email duplicado (código de Prisma P2002)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al guardar el lead" }, { status: 500 });
  }
}
