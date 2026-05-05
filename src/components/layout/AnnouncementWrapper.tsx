"use client";

import { usePathname } from 'next/navigation';

export default function AnnouncementWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Ocultar la barra de anuncios en las rutas del panel de administrador
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <>{children}</>;
}
