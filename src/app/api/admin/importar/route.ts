import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as xlsx from "xlsx";

function generarSlug(texto: string) {
  let str = texto.toLowerCase();
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quitar tildes
  str = str.replace(/[^a-z0-9]+/g, "-"); // Reemplazar no alfanumericos por guion
  return str.replace(/^-+|-+$/g, ""); // Quitar guiones al inicio o final
}

function parseJSONString(val: any): string {
  if (!val) return "[]";
  const valStr = String(val).trim();
  if (valStr.startsWith("[") && valStr.endsWith("]")) return valStr;
  const items = valStr.split(",").map(i => i.trim()).filter(Boolean);
  return JSON.stringify(items);
}

function parseStockInfo(val: any): { stock_por_talle: string, total_stock: number } {
  if (!val) return { stock_por_talle: "{}", total_stock: 0 };
  const valStr = String(val).trim();
  
  if (valStr.startsWith("{") && valStr.endsWith("}")) {
    try {
      const obj = JSON.parse(valStr);
      const total = Object.values(obj).reduce((sum: number, v: any) => sum + (parseInt(v) || 0), 0);
      return { stock_por_talle: valStr, total_stock: total };
    } catch { }
  }

  const stockDict: Record<string, number> = {};
  let total_stock = 0;
  
  const parts = valStr.split(",").map(p => p.trim()).filter(Boolean);
  parts.forEach(p => {
    if (p.includes(":")) {
      const [k, v] = p.split(":");
      const num = parseInt(v.trim()) || 0;
      stockDict[k.trim()] = num;
      total_stock += num;
    }
  });

  return { stock_por_talle: JSON.stringify(stockDict), total_stock };
}

// IA de detección de columnas (Fuzzy Matching básico)
function findColumnKey(row: any, exactKeywords: string[], fuzzyKeywords: string[] = []): any {
  const keys = Object.keys(row);
  // 1. Búsqueda exacta primero (ej: "precio" no debe confundirse con "precio mayorista")
  for (const k of keys) {
    const lowerK = k.toLowerCase().trim();
    if (exactKeywords.includes(lowerK)) return row[k];
  }
  // 2. Búsqueda difusa (fuzzy)
  for (const k of keys) {
    const lowerK = k.toLowerCase().trim();
    for (const word of fuzzyKeywords) {
      if (lowerK.includes(word)) return row[k];
    }
  }
  return undefined;
}

export async function POST(req: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No se proporcionó ningún archivo." }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Leer el Excel
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!rawData || rawData.length === 0) {
      return NextResponse.json({ error: "El archivo está vacío." }, { status: 400 });
    }

    const productosAProcesar = [];

    // Mapeo Inteligente Mejorado
    for (const row of rawData as any[]) {
      const nombre = findColumnKey(row, ["nombre", "producto", "articulo", "title"], ["nombre", "articulo", "producto"]);
      if (!nombre) continue; // Ignorar filas sin nombre

      const slug = generarSlug(String(nombre));
      
      const categoria = findColumnKey(row, ["categoria", "rubro", "tipo", "familia"], ["categoria", "rubro", "tipo"]) || "General";
      
      // Para precio minorista, buscamos exactamente "precio" primero, y si no, difuso por "minorista" o "publico"
      const precio_minorista = parseInt(findColumnKey(row, ["precio", "precio final", "precio unitario"], ["minorista", "venta", "publico"])) || 0;
      const precio_mayorista = parseInt(findColumnKey(row, ["precio mayorista", "costo"], ["mayorista", "costo", "x mayor", "por mayor"])) || 0;
      
      const descripcion = findColumnKey(row, ["descripcion", "detalle", "info"], ["descripcion", "detalle"]);
      const codigo_interno = findColumnKey(row, ["codigo", "sku", "id"], ["codigo", "sku"]);
      
      const talles = parseJSONString(findColumnKey(row, ["talle", "talles", "size", "tamaño"], ["talle", "size"]));
      const colores = parseJSONString(findColumnKey(row, ["color", "colores", "tono"], ["color", "tono"]));
      
      const stock_bruto = findColumnKey(row, ["stock_por_talle", "inventario talles"], ["stock_por_talle", "matriz"]);
      const { stock_por_talle, total_stock } = parseStockInfo(stock_bruto);
      
      // Stock general como fallback si no hay por talle
      const stock_general = parseInt(findColumnKey(row, ["stock", "cantidad"], ["stock", "inventario", "cantidad"])) || 0;
      const stockFinal = total_stock > 0 ? total_stock : stock_general;

      const oculto = Boolean(findColumnKey(row, ["oculto", "escondido", "borrador"], ["oculto", "borrador"]));
      const destacado = Boolean(findColumnKey(row, ["destacado", "estrella", "home"], ["destacado", "estrella"]));
      
      const fotos_bruto = findColumnKey(row, ["foto", "fotos", "imagen", "imagenes", "url", "image"], ["foto", "imagen", "url"]);
      const fotos = parseJSONString(fotos_bruto);
      
      productosAProcesar.push({
        slug,
        nombre: String(nombre).trim(),
        categoria: String(categoria).trim(),
        precio_mayorista,
        precio_minorista,
        descripcion: String(descripcion),
        codigo_interno: String(codigo_interno),
        talles,
        colores,
        stock_por_talle,
        stock: stockFinal,
        fotos,
        oculto,
        destacado,
        novedad: true
      });
    }

    if (productosAProcesar.length === 0) {
      return NextResponse.json({ error: "No se encontraron productos válidos en el archivo." }, { status: 400 });
    }

    // Ejecutar UPSERT Masivo usando la nueva sintaxis transaccional de Prisma
    let actualizados = 0;
    let creados = 0;

    await prisma.$transaction(
      productosAProcesar.map(p => 
        prisma.producto.upsert({
          where: { slug: p.slug },
          update: {
            nombre: p.nombre,
            categoria: p.categoria,
            precio_mayorista: p.precio_mayorista,
            precio_minorista: p.precio_minorista,
            descripcion: p.descripcion,
            codigo_interno: p.codigo_interno,
            talles: p.talles,
            colores: p.colores,
            stock_por_talle: p.stock_por_talle,
            stock: p.stock,
            fotos: p.fotos,
            oculto: p.oculto,
            destacado: p.destacado
          },
          create: p
        })
      )
    );

    return NextResponse.json({ 
      success: true, 
      mensaje: `Sincronización exitosa: ${productosAProcesar.length} productos procesados.`,
      totalProcesados: productosAProcesar.length
    });

  } catch (error: any) {
    console.error("Error importando Excel:", error);
    return NextResponse.json({ error: "Hubo un error procesando el archivo: " + error.message }, { status: 500 });
  }
}
