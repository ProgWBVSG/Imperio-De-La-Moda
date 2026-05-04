import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import LayoutContent from "@/components/layout/LayoutContent";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imperiolamoda.com.ar"),
  title: {
    default: "Imperio de la Moda | Ropa Mayorista y Minorista en Córdoba, Argentina",
    template: "%s | Imperio de la Moda — Córdoba",
  },
  description: "Comprá ropa de calidad a precio justo en Córdoba. Mayorista desde 6 prendas con hasta 40% de ahorro. Mujer, Hombre y Niños. San Martín 382, Centro. Atención por WhatsApp.",
  keywords: [
    "ropa mayorista Córdoba",
    "mayorista ropa Córdoba",
    "ropa por mayor Córdoba",
    "comprar ropa por mayor Argentina",
    "ropa barata Córdoba",
    "indumentaria Córdoba",
    "ropa al por mayor",
    "tienda de ropa Córdoba",
    "local de ropa centro Córdoba",
    "ropa mujer Córdoba",
    "ropa hombre Córdoba",
    "ropa niños Córdoba",
    "camperas mayorista Córdoba",
    "jeans mayorista Córdoba",
    "remeras por mayor Córdoba",
    "buzos mayorista Córdoba",
    "ropa para revender",
    "revender ropa Argentina",
    "emprender con ropa",
    "proveedor de ropa Córdoba",
    "distribuidor ropa interior Argentina",
    "ropa económica Córdoba capital",
    "moda Córdoba precios",
    "imperio de la moda",
    "imperio de la moda Córdoba",
    "ropa San Martín Córdoba",
    "outlet ropa Córdoba",
    "ofertas ropa Córdoba",
    "promociones ropa Córdoba",
    "ropa calidad precio Argentina",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://imperiolamoda.com.ar",
    siteName: "Imperio de la Moda",
    title: "Imperio de la Moda | Ropa Mayorista y Minorista en Córdoba",
    description: "Comprá ropa de calidad a precio justo. Mayorista desde 6 prendas. Mujer, Hombre y Niños. San Martín 382, Córdoba.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Imperio de la Moda — Tienda de Ropa en Córdoba" }],
  },
  twitter: { card: "summary_large_image", title: "Imperio de la Moda | Ropa en Córdoba", description: "Mayorista y minorista. Calidad, precio justo y atención directa." },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://imperiolamoda.com.ar" },
  icons: {
    icon: "/logo-imperio.png",
    apple: "/logo-imperio.png",
  },
  verification: {
    // Completar después de registrar en Google Search Console
    // google: "tu-codigo-de-verificacion",
  },
};

const schemaLocalBusiness = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Imperio de la Moda",
  alternateName: "El Imperio de la Moda",
  description: "Tienda de ropa mayorista y minorista en el centro de Córdoba. Ropa de mujer, hombre y niños a precios accesibles con calidad garantizada.",
  url: "https://imperiolamoda.com.ar",
  image: "https://imperiolamoda.com.ar/logo-imperio.png",
  logo: "https://imperiolamoda.com.ar/logo-imperio.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "San Martín 382",
    addressLocality: "Córdoba",
    addressRegion: "Córdoba",
    postalCode: "X5000",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -31.4117,
    longitude: -64.1821,
  },
  telephone: "+5493512336795",
  priceRange: "$$",
  currenciesAccepted: "ARS",
  paymentAccepted: "Efectivo, Transferencia Bancaria",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/elimperiodelamoda.cba/",
    "https://www.tiktok.com/@elimperiodelamodacba",
  ],
  areaServed: {
    "@type": "City",
    name: "Córdoba",
    "@id": "https://www.wikidata.org/wiki/Q51100",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Catálogo de Ropa",
    itemListElement: [
      { "@type": "OfferCatalog", name: "Ropa Mujer" },
      { "@type": "OfferCatalog", name: "Ropa Hombre" },
      { "@type": "OfferCatalog", name: "Ropa Niños" },
      { "@type": "OfferCatalog", name: "Accesorios" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLocalBusiness) }}
        />
      </head>
      <body>
        <CartProvider>
          <LayoutContent>{children}</LayoutContent>
        </CartProvider>
      </body>
    </html>
  );
}

