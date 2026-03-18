"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, quitarItem, actualizarCantidad, subtotal, cantidadTotal, vaciarCarrito, generarMensajeWhatsApp } = useCart();
  
  const [esMayorista, setEsMayorista] = useState(false);
  const [nombre, setNombre] = useState("");

  const MIN_MAYORISTA = 6; // Confirmar esto con el cliente

  // Validación automática: Si lleva la cantidad mínima, sugerir o forzar a mayorista
  const handleEsMayoristaToggle = (val: boolean) => {
    if (val && cantidadTotal < MIN_MAYORISTA) {
      alert(`Para acceder al precio mayorista debes llevar al menos ${MIN_MAYORISTA} artículos en total.`);
      return;
    }
    setEsMayorista(val);
  };

  const handleCheckout = () => {
    if (!nombre.trim()) {
      alert("Por favor ingresá tu nombre para tomar el pedido.");
      return;
    }
    const url = generarMensajeWhatsApp(nombre, esMayorista);
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-bg px-4">
        <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <h1 className="font-display text-3xl font-bold text-primary mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">Parece que aún no elegiste ningún producto de nuestro catálogo. ¡Aprovechá nuestros precios mayoristas!</p>
        <Link href="/catalogo" className="bg-primary text-white px-8 py-3 rounded-radius-base font-bold hover:bg-opacity-90 transition-colors">
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-8">Mi Carrito</h1>

        <div className="flex flex-col lg:flex-row gap-12 text-sm md:text-base">
          
          {/* LISTA DE ITEMS */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-border p-4 md:p-6 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 text-gray-500 font-bold border-b border-border pb-4 mb-4 text-xs uppercase tracking-wider">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Precio {esMayorista ? 'May.' : 'Min.'}</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="py-4 md:py-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                    
                    {/* Info de Producto */}
                    <div className="col-span-6 flex items-center gap-4 w-full">
                      <div className="relative w-20 h-24 md:w-24 md:h-32 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {item.imagen && <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />}
                      </div>
                      <div className="flex flex-col flex-1">
                        <Link href={`/producto/${item.productoId}`} className="font-bold text-primary hover:text-accent leading-tight line-clamp-2 md:text-lg mb-1">{item.nombre}</Link>
                        <div className="text-gray-500 text-xs md:text-sm space-y-0.5 mt-1">
                          {item.talle && <p>Talle: <span className="font-bold">{item.talle}</span></p>}
                          {item.color && <p>Color: <span className="font-bold">{item.color}</span></p>}
                        </div>
                        <button onClick={() => quitarItem(item.id)} className="text-red-500 text-sm font-bold text-left mt-3 hover:underline md:hidden">
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {/* Controles y Precios */}
                    <div className="col-span-6 w-full flex justify-between md:contents items-center mt-4 md:mt-0">
                      
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100">-</button>
                          <span className="w-10 text-center font-bold">{item.cantidad}</span>
                          <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100">+</button>
                        </div>
                      </div>

                      <div className="col-span-2 text-right font-medium hidden md:block">
                        ${esMayorista ? item.precio_mayorista.toLocaleString('es-AR') : item.precio_minorista.toLocaleString('es-AR')}
                      </div>

                      <div className="col-span-2 text-right font-bold text-lg md:text-base">
                        ${(item.cantidad * (esMayorista ? item.precio_mayorista : item.precio_minorista)).toLocaleString('es-AR')}
                      </div>

                    </div>
                    
                    {/* Botón Eliminar Desktop */}
                    <div className="hidden md:flex absolute right-0 col-span-12 justify-end -mt-8 mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Opcional */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={vaciarCarrito} className="text-gray-500 hover:text-red-500 font-bold text-sm transition-colors">
              Vaciar carrito
            </button>
          </div>

          {/* RESUMEN DE COMPRA */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 sticky top-24">
              <h2 className="font-display font-bold text-2xl text-primary border-b border-border pb-4 mb-6">Resumen</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Productos ({cantidadTotal})</span>
                  <span>${subtotal(false).toLocaleString('es-AR')}</span>
                </div>
                
                {/* Switcher Mayorista/Minorista */}
                <div className="p-4 bg-surface rounded-lg border border-border mt-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-primary block">Comprar por Mayor</span>
                      <span className="text-xs text-gray-500">Mínimo {MIN_MAYORISTA} art.</span>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={esMayorista} onChange={(e) => handleEsMayoristaToggle(e.target.checked)} />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${esMayorista ? 'bg-whatsapp' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${esMayorista ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                  </label>
                  {esMayorista && (
                    <div className="mt-3 text-sm font-bold text-whatsapp bg-whatsapp/10 p-2 rounded text-center">
                      ¡Se aplicaron precios mayoristas!
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-primary">Total Estimado</span>
                  <span className="font-bold text-3xl text-primary">${subtotal(esMayorista).toLocaleString('es-AR')}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 italic text-right">* El pago se coordina por WhatsApp</p>
              </div>

              {/* Formulario previo al envío */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Nombre Completo *</label>
                  <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: María López" 
                    className="w-full border border-border rounded-lg p-3 focus:ring-2 focus:ring-accent outline-none"
                    required
                  />
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-whatsapp text-white py-4 rounded-radius-base font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)]"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.096-1.332-.116-.399-.129-1.071-.352-2.05-1.127-1.106-.878-1.722-2.087-1.917-2.359-.14-.195-.477-.6-.477-1.163 0-.583.273-.892.4-.103.11-.122.258-.142.35-.142.11 0 .204.004.298.006.115.006.27-.044.423.324.156.377.534 1.304.58 1.402.046.096.082.203.013.344-.069.143-.106.23-.21.353-.105.123-.224.272-.319.349-.107.086-.22.18-.101.385.118.204.526.87 1.134 1.41.785.698 1.439.914 1.644.914.205 0 .324.088.441-.044.116-.134.502-.584.636-.786.134-.202.268-.168.455-.098.188.07.118-.616 1.391-.685.187-.07.31-.105.356-.142.045-.038.045-.195-.098-.6z" /></svg>
                Realizar Pedido
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
