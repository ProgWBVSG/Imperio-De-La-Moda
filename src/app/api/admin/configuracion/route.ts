import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const record = await prisma.configuracion.findUnique({
      where: { key: "global" }
    });
    if (!record) {
      return NextResponse.json({
        numeroWhatsApp: "+5493512336795",
        horarios: "L a V: 9:00 – 18:00 · Sáb: 9:00 – 13:00",
        direccion: "San Martín 390, X5000 Córdoba",
        instagram: "@elimperiodelamoda.cba",
        tiktok: "@elimperiodelamodacba",
        mensajeWAHeader: "Hola Imperio de la Moda! Quiero consultar por:",
        enviosActivos: false,
        modoMantenimiento: false,
        anuncio_texto: "🔥 Los mejores precios mayoristas del país",
        mostrar_anuncio: true
      });
    }
    return NextResponse.json(JSON.parse(record.value));
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener la configuración" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const value = JSON.stringify(data);
    const result = await prisma.configuracion.upsert({
      where: { key: "global" },
      update: { value },
      create: { key: "global", value }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar la configuración" }, { status: 500 });
  }
}
