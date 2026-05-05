"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ChatbotWidget from "@/components/ui/ChatbotWidget";

export default function LayoutContent({ children, announcement }: { children: React.ReactNode, announcement?: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin: renderizar solo el contenido, sin navbar/footer/chatbot
    return <>{children}</>;
  }

  // Sitio público: header sticky con announcement + navbar
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 w-full z-50 flex flex-col">
        {announcement}
        <Navbar />
      </div>
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatbotWidget />
    </div>
  );
}
