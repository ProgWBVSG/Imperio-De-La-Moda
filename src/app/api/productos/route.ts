import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q');
  const cat = searchParams.get('categoria');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;

  try {
    const products = await prisma.producto.findMany({
      where: {
        oculto: false,
        ...(search ? { nombre: { contains: search } } : {}),
        ...(cat ? { categoria: cat } : {})
      },
      take: limit,
      orderBy: { creado_en: 'desc' }
    });

    // Parse JSON fields for frontend consumption
    const parsed = products.map((p: any) => ({
      ...p,
      talles: JSON.parse(p.talles),
      colores: JSON.parse(p.colores),
      fotos: JSON.parse(p.fotos),
      stock_por_talle: JSON.parse(p.stock_por_talle),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error conectando a Prisma. Devolviendo Mocks:", error);
    
    const mockProducts = [
      { id: "1", slug: "campera-puffer-negra", nombre: "Campera Puffer Negra", categoria: "mujer", precio_mayorista: 18000, precio_minorista: 25000, descripcion: "Campera puffer super abrigada e impermeable.", talles: ["S", "M", "L"], colores: ["Negro"], fotos: ["https://images.unsplash.com/photo-1551028719-0c124a152d4c?w=500&auto=format&fit=crop"], stock: 10, oculto: false },
      { id: "2", slug: "pantalon-cargo-beige", nombre: "Pantalón Cargo", categoria: "hombre", precio_mayorista: 12000, precio_minorista: 18000, descripcion: "Pantalón cargo de gabardina premium.", talles: ["38", "40", "42"], colores: ["Beige", "Verde"], fotos: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop"], stock: 5, oculto: false },
      { id: "3", slug: "remera-basica-blanca", nombre: "Remera Básica", categoria: "mujer", precio_mayorista: 4000, precio_minorista: 6500, descripcion: "Remera 100% algodón, ideal para estampar.", talles: ["S", "M", "L", "XL"], colores: ["Blanco", "Negro", "Gris"], fotos: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop"], stock: 50, oculto: false },
      { id: "4", slug: "vestido-fiesta-rojo", nombre: "Vestido de Fiesta Gasa", categoria: "mujer", precio_mayorista: 15000, precio_minorista: 22000, descripcion: "Vestido elegante largo de gasa para eventos.", talles: ["S", "M"], colores: ["Rojo"], fotos: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&auto=format&fit=crop"], stock: 3, oculto: false },
      { id: "5", slug: "buzo-canguro-nino", nombre: "Buzo Canguro Frisa", categoria: "ninos", precio_mayorista: 9000, precio_minorista: 14000, descripcion: "Abrigado buzo canguro con capucha.", talles: ["4", "6", "8", "10"], colores: ["Azul", "Gris", "Rojo"], fotos: ["https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&auto=format&fit=crop"], stock: 15, oculto: false },
      { id: "6", slug: "jeans-mom-clasico", nombre: "Jeans Mom Rígido", categoria: "mujer", precio_mayorista: 14000, precio_minorista: 20000, descripcion: "Jean tiro alto rígido azul clásico.", talles: ["36", "38", "40", "42", "44"], colores: ["Azul Claro"], fotos: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop"], stock: 20, oculto: false },
      { id: "7", slug: "camisa-lino-hombre", nombre: "Camisa de Lino", categoria: "hombre", precio_mayorista: 16000, precio_minorista: 23000, descripcion: "Camisa fresca ideal verano. Calidad increíble.", talles: ["M", "L", "XL"], colores: ["Blanco", "Beige"], fotos: ["https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&auto=format&fit=crop"], stock: 12, oculto: false },
      { id: "8", slug: "cartera-cuero-ecologico", nombre: "Cartera Tote Bag", categoria: "accesorios", precio_mayorista: 11000, precio_minorista: 17000, descripcion: "Amplia y resistente para el día a día.", talles: ["Único"], colores: ["Negro", "Suela"], fotos: ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&auto=format&fit=crop"], stock: 8, oculto: false },
    ];

    let filtered = mockProducts;
    if (search) filtered = filtered.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));
    if (cat) filtered = filtered.filter(p => p.categoria.toLowerCase() === cat.toLowerCase());
    if (limit) filtered = filtered.slice(0, limit);

    return NextResponse.json(filtered);
  }
}
