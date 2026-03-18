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
  title: {
    default: "Imperio de la Moda | Mayorista y Minorista de Ropa en Córdoba",
    template: "%s | Imperio de la Moda",
  },
  description: "Ropa de calidad desde $4.000 hasta $20.000 ARS. Mayorista y minorista. San Martín 390, Córdoba. Visitanos o escribinos por WhatsApp.",
  keywords: ["mayorista ropa Córdoba", "ropa barata Córdoba", "indumentaria Córdoba", "ropa al por mayor"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://imperiolamoda.com.ar",
    siteName: "Imperio de la Moda",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://imperiolamoda.com.ar" },
};

const schemaLocalBusiness = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Imperio de la Moda",
  address: {
    "@type": "PostalAddress",
    streetAddress: "San Martín 390",
    addressLocality: "Córdoba",
    addressRegion: "Córdoba",
    postalCode: "X5000",
    addressCountry: "AR",
  },
  telephone: "+5493515555123",
  priceRange: "$$",
  url: "https://imperiolamoda.com.ar",
  sameAs: [
    "https://instagram.com/imperiolamoda",
    "https://tiktok.com/@imperiolamoda",
  ],
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

