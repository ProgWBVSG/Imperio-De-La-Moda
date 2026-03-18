"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

// Helper para verificar auth
async function requireAuth() {
  const session = await getServerSession();
  if (!session) throw new Error("No autorizado");
}

export async function createProduct(formData: FormData) {
  await requireAuth();

  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const precio_mayorista = Number(formData.get("precio_mayorista"));
  const precio_minorista = Number(formData.get("precio_minorista"));
  const categoria = formData.get("categoria") as string;
  const stock = Number(formData.get("stock"));
  const oculto = formData.get("oculto") === "on";

  // Procesamiento de arrays desde strings separadas por coma
  const tallesRaw = formData.get("talles") as string;
  const talles = tallesRaw ? tallesRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  const coloresRaw = formData.get("colores") as string;
  const colores = coloresRaw ? coloresRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  const fotosRaw = formData.get("fotos") as string;
  const fotos = fotosRaw ? fotosRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    await prisma.producto.create({
      data: {
        nombre,
        slug,
        descripcion,
        precio_mayorista,
        precio_minorista,
        categoria,
        stock,
        talles,
        colores,
        fotos,
        oculto
      }
    });

    revalidatePath('/admin/productos');
    revalidatePath('/catalogo');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  await requireAuth();
  try {
    await prisma.producto.delete({ where: { id } });
    revalidatePath('/admin/productos');
    revalidatePath('/catalogo');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleVisibility(id: string, currentState: boolean) {
  await requireAuth();
  try {
    await prisma.producto.update({
      where: { id },
      data: { oculto: !currentState }
    });
    revalidatePath('/admin/productos');
    revalidatePath('/catalogo');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
