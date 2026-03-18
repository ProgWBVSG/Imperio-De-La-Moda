const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const productos = [
  {
    slug: "campera-puffer-negra",
    nombre: "Campera Puffer Negra",
    categoria: "Mujer",
    precio_mayorista: 14000,
    precio_minorista: 18000,
    descripcion: "Campera inflable ideal para invierno. Relleno sintético de alta densidad.",
    talles: JSON.stringify(["S", "M", "L", "XL"]),
    colores: JSON.stringify(["Negro"]),
    stock_por_talle: JSON.stringify({ S: 2, M: 5, L: 3, XL: 0 }),
    fotos: JSON.stringify(["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop"]),
    stock: 10,
    oculto: false,
    destacado: true,
    novedad: false,
  },
  {
    slug: "pantalon-cargo-beige",
    nombre: "Pantalón Cargo Beige",
    categoria: "Hombre",
    precio_mayorista: 11000,
    precio_minorista: 14500,
    descripcion: "Pantalón cargo holgado con bolsillos laterales. Gabardina premium.",
    talles: JSON.stringify(["38", "40", "42", "44"]),
    colores: JSON.stringify(["Beige", "Negro"]),
    stock_por_talle: JSON.stringify({ "38": 4, "40": 3, "42": 0, "44": 1 }),
    fotos: JSON.stringify(["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop"]),
    stock: 8,
    oculto: false,
    destacado: false,
    novedad: true,
  },
  {
    slug: "remera-basica-blanca",
    nombre: "Remera Básica Blanca",
    categoria: "Mujer",
    precio_mayorista: 3000,
    precio_minorista: 4500,
    descripcion: "Remera algodón 100% básica. Ideal para combinar.",
    talles: JSON.stringify(["S", "M", "L", "XL"]),
    colores: JSON.stringify(["Blanco", "Negro", "Gris"]),
    stock_por_talle: JSON.stringify({ S: 0, M: 0, L: 0, XL: 0 }),
    fotos: JSON.stringify(["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"]),
    stock: 0,
    oculto: false,
    destacado: false,
    novedad: false,
  },
  {
    slug: "jean-recto-azul",
    nombre: "Jean Recto Azul",
    categoria: "Hombre",
    precio_mayorista: 12000,
    precio_minorista: 16000,
    descripcion: "Jean recto clásico azul oscuro. Denim grueso.",
    talles: JSON.stringify(["38", "40", "42", "44"]),
    colores: JSON.stringify(["Azul"]),
    stock_por_talle: JSON.stringify({ "38": 2, "40": 5, "42": 3, "44": 2 }),
    fotos: JSON.stringify(["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&h=500&fit=crop"]),
    stock: 12,
    oculto: true,
    destacado: false,
    novedad: false,
  },
  {
    slug: "buzo-oversize-gris",
    nombre: "Buzo Oversize Gris",
    categoria: "Mujer",
    precio_mayorista: 9000,
    precio_minorista: 12000,
    descripcion: "Buzo oversize ultra cómodo. Frisa por dentro.",
    talles: JSON.stringify(["S", "M", "L", "XL"]),
    colores: JSON.stringify(["Gris", "Negro"]),
    stock_por_talle: JSON.stringify({ S: 1, M: 0, L: 1, XL: 0 }),
    fotos: JSON.stringify(["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop"]),
    stock: 2,
    oculto: false,
    destacado: false,
    novedad: true,
  },
  {
    slug: "calza-deportiva-negra",
    nombre: "Calza Deportiva Negra",
    categoria: "Mujer",
    precio_mayorista: 5000,
    precio_minorista: 7500,
    descripcion: "Calza deportiva de lycra. Cintura alta.",
    talles: JSON.stringify(["S", "M", "L", "XL"]),
    colores: JSON.stringify(["Negro"]),
    stock_por_talle: JSON.stringify({ S: 5, M: 8, L: 6, XL: 3 }),
    fotos: JSON.stringify(["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop"]),
    stock: 22,
    oculto: false,
    destacado: true,
    novedad: false,
  },
  {
    slug: "campera-cuero-sintetico",
    nombre: "Campera de Cuero",
    categoria: "Hombre",
    precio_mayorista: 25000,
    precio_minorista: 32000,
    descripcion: "Campera de cuero sintético premium. Forro interno.",
    talles: JSON.stringify(["M", "L", "XL"]),
    colores: JSON.stringify(["Negro", "Marrón"]),
    stock_por_talle: JSON.stringify({ M: 1, L: 1, XL: 1 }),
    fotos: JSON.stringify(["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop"]),
    stock: 3,
    oculto: false,
    destacado: false,
    novedad: false,
  },
  {
    slug: "short-jean-celeste",
    nombre: "Short Jean Celeste",
    categoria: "Mujer",
    precio_mayorista: 6000,
    precio_minorista: 8500,
    descripcion: "Short de jean tiro alto. Ideal para verano.",
    talles: JSON.stringify(["S", "M", "L", "XL"]),
    colores: JSON.stringify(["Celeste"]),
    stock_por_talle: JSON.stringify({ S: 5, M: 5, L: 3, XL: 2 }),
    fotos: JSON.stringify(["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop"]),
    stock: 15,
    oculto: false,
    destacado: false,
    novedad: true,
  },
];

async function main() {
  console.log("🌱 Seeding base de datos...");
  
  // Borrar todos los productos existentes
  await prisma.producto.deleteMany();
  
  // Crear productos
  for (const p of productos) {
    await prisma.producto.create({ data: p });
    console.log(`  ✓ ${p.nombre}`);
  }
  
  console.log(`\n✅ ${productos.length} productos creados!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
