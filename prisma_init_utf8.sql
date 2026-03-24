-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precio_mayorista" INTEGER NOT NULL,
    "precio_minorista" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL DEFAULT '',
    "codigo_interno" TEXT NOT NULL DEFAULT '',
    "talles" TEXT NOT NULL DEFAULT '[]',
    "colores" TEXT NOT NULL DEFAULT '[]',
    "stock_por_talle" TEXT NOT NULL DEFAULT '{}',
    "fotos" TEXT NOT NULL DEFAULT '[]',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "oculto" BOOLEAN NOT NULL DEFAULT false,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "novedad" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_slug_key" ON "Producto"("slug");

-- CreateIndex
CREATE INDEX "Producto_categoria_idx" ON "Producto"("categoria");

-- CreateIndex
CREATE INDEX "Producto_slug_idx" ON "Producto"("slug");

