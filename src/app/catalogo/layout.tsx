import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Ropa | Mujer, Hombre, Niños y Accesorios',
  description: 'Explorá todo el catálogo de Imperio de la Moda. Filtrá por categoría, precio y promociones. Ropa mayorista y minorista en Córdoba con precios desde $4.000.',
  alternates: { canonical: 'https://imperiolamoda.com.ar/catalogo' },
  openGraph: {
    title: 'Catálogo Completo | Imperio de la Moda — Córdoba',
    description: 'Ropa de mujer, hombre, niños y accesorios. Precios mayoristas y minoristas. Filtrá por categoría y precio.',
  },
};

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
