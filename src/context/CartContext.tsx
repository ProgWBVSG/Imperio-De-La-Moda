"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  productoId: string;
  nombre: string;
  precio_mayorista: number;
  precio_minorista: number;
  cantidad: number;
  talle: string;
  color?: string;
  imagen: string;
}

interface CartContextType {
  items: CartItem[];
  agregarItem: (item: CartItem) => void;
  quitarItem: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  generarMensajeWhatsApp: (nombreCliente?: string, esMayorista?: boolean) => string;
  generarMensajeProducto: (producto: { nombre: string; talle?: string; color?: string; cantidad?: number }) => string;
  cantidadTotal: number;
  subtotal: (esMayorista: boolean) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [inited, setInited] = useState(false);
  const [toast, setToast] = useState<{message: string, id: number} | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("imperio_carrito");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Error cargando carrito", e);
      }
    }
    setInited(true);
  }, []);

  useEffect(() => {
    if (inited) {
      localStorage.setItem("imperio_carrito", JSON.stringify(items));
    }
  }, [items, inited]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const agregarItem = (newItem: CartItem) => {
    setItems((prev) => {
      const index = prev.findIndex(i => i.id === newItem.id);
      if (index >= 0) {
        const arr = [...prev];
        arr[index].cantidad += newItem.cantidad;
        return arr;
      }
      return [...prev, newItem];
    });
    setToast({ message: `✅ ${newItem.nombre} agregado al carrito`, id: Date.now() });
  };

  const quitarItem = (id: string) => {
    setItems((prev) => prev.filter(i => i.id !== id));
  };

  const actualizarCantidad = (id: string, cantidad: number) => {
    if (cantidad <= 0) return quitarItem(id);
    setItems((prev) => prev.map(i => i.id === id ? { ...i, cantidad } : i));
  };

  const vaciarCarrito = () => setItems([]);

  const subtotal = (esMayorista: boolean) => {
    return items.reduce((acc, item) => {
      const precio = esMayorista ? item.precio_mayorista : item.precio_minorista;
      return acc + (precio * item.cantidad);
    }, 0);
  };

  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

  // ============================================
  // MENSAJE WHATSAPP PARA UN PRODUCTO INDIVIDUAL
  // ============================================
  const generarMensajeProducto = (producto: { nombre: string; talle?: string; color?: string; cantidad?: number }) => {
    const NUMERO_WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493512336795";
    
    let detalles = "";
    if (producto.talle) detalles += ` en talle ${producto.talle}`;
    if (producto.color) detalles += ` color ${producto.color}`;
    if (producto.cantidad && producto.cantidad > 1) detalles += ` (${producto.cantidad} unidades)`;
    
    const msg = `Hola, me interesa ${producto.nombre.toLowerCase()}${detalles}. ¿Tienen stock disponible? Me gustaría saber más detalles y cómo puedo comprarlo. ¡Gracias!`;
    
    return `https://api.whatsapp.com/send?phone=${NUMERO_WA}&text=${encodeURIComponent(msg)}`;
  };

  // ============================================
  // MENSAJE WHATSAPP PARA EL CARRITO COMPLETO
  // ============================================
  const generarMensajeWhatsApp = (nombreCliente?: string, esMayorista: boolean = false) => {
    const NUMERO_WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493512336795";
    
    // Agrupar por nombre de producto para un mensaje más natural
    const productosAgrupados: Record<string, { items: CartItem[]; totalCantidad: number }> = {};
    items.forEach(item => {
      if (!productosAgrupados[item.nombre]) {
        productosAgrupados[item.nombre] = { items: [], totalCantidad: 0 };
      }
      productosAgrupados[item.nombre].items.push(item);
      productosAgrupados[item.nombre].totalCantidad += item.cantidad;
    });

    const nombres = Object.keys(productosAgrupados);

    // Construir la lista de productos en lenguaje natural
    let listaProductos = "";
    if (nombres.length === 1) {
      // Un solo tipo de producto
      const grupo = productosAgrupados[nombres[0]];
      const detalles = grupo.items.map(item => {
        let d = "";
        if (item.talle) d += `talle ${item.talle}`;
        if (item.color) d += `${d ? ", " : ""}color ${item.color}`;
        if (item.cantidad > 1) d += `${d ? " " : ""}(${item.cantidad} unidades)`;
        return d;
      }).filter(Boolean).join("; ");
      
      listaProductos = `${nombres[0].toLowerCase()}${detalles ? ` — ${detalles}` : ""}`;
    } else {
      // Múltiples productos — listar de forma natural
      const partes = nombres.map(nombre => {
        const grupo = productosAgrupados[nombre];
        const variantes = grupo.items.map(item => {
          const parts: string[] = [];
          if (item.talle) parts.push(`talle ${item.talle}`);
          if (item.color) parts.push(`color ${item.color}`);
          if (item.cantidad > 1) parts.push(`${item.cantidad} unidades`);
          return parts.length > 0 ? `(${parts.join(", ")})` : "";
        }).filter(Boolean);
        
        return `${nombre.toLowerCase()}${variantes.length > 0 ? " " + variantes.join(", ") : ""}`;
      });

      // Unir con comas y "y" al final
      if (partes.length === 2) {
        listaProductos = `${partes[0]} y ${partes[1]}`;
      } else {
        listaProductos = partes.slice(0, -1).join(", ") + " y " + partes[partes.length - 1];
      }
    }

    // --- Componer el mensaje final ---
    const total = subtotal(esMayorista);
    const totalStr = total.toLocaleString('es-AR');
    const tipoCompra = esMayorista ? "por mayor" : "por menor";

    let mensaje = `Hola, ¿cómo están? Quiero consultar por los siguientes productos: ${listaProductos}.`;
    mensaje += `\n\nSería una compra ${tipoCompra}, el total que me da es $${totalStr}.`;
    mensaje += `\n\n¿Tienen todo disponible? ¿Cómo sería el pago y el envío?`;

    if (nombreCliente) {
      mensaje += `\n\nMi nombre es ${nombreCliente.trim()}.`;
    }

    mensaje += `\n\n¡Gracias!`;

    return `https://api.whatsapp.com/send?phone=${NUMERO_WA}&text=${encodeURIComponent(mensaje)}`;
  };

  return (
    <CartContext.Provider value={{
      items,
      agregarItem,
      quitarItem,
      actualizarCantidad,
      vaciarCarrito,
      generarMensajeWhatsApp,
      generarMensajeProducto,
      cantidadTotal,
      subtotal
    }}>
      {children}
      
      {/* GLOBAL TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-primary text-white px-6 py-4 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3">
            <span className="font-bold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}
