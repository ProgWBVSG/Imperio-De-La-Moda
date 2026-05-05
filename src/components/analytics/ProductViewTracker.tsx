"use client";

import { useEffect, useRef } from "react";

export function ProductViewTracker({ productId }: { productId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    // Solo registrar la vista una vez por montaje
    if (tracked.current) return;
    tracked.current = true;

    // Solo contar si estamos en el navegador y el usuario lleva al menos 3 segundos mirando
    // Esto evita contar rebotes automáticos de bots
    const timer = setTimeout(() => {
      fetch(`/api/productos/${productId}/view`, { method: "POST" }).catch(() => {});
    }, 3000);

    return () => clearTimeout(timer);
  }, [productId]);

  return null; // Componente invisible
}
