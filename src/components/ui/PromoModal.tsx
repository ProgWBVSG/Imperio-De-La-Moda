"use client";

import { useState, useEffect } from "react";

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Revisar si ya vimos el popup o si ya nos suscribimos
    const hasSeenModal = localStorage.getItem("imperio_promo_seen");
    
    // Si no lo vio, mostramos después de 3 segundos
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem("imperio_promo_seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      setErrorMsg("Por favor, completa ambos campos.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        localStorage.setItem("imperio_promo_seen", "true"); // No volver a molestar
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Ocurrió un error. Intenta de nuevo.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg("Error de conexión.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="bg-bg w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up border border-accent/20">
        
        {/* Encabezado visual */}
        <div className="bg-primary p-6 text-center border-b border-accent/20 relative">
          <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
            ¿Querés enterarte de <span className="text-accent">promociones exclusivas</span>?
          </h2>
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-8">
          {status === "success" ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-whatsapp/20 text-whatsapp rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">¡Genial {nombre}!</h3>
              <p className="text-gray-600">Te mantendremos al tanto de las mejores oportunidades.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-center text-sm text-gray-600 mb-6">
                Dejanos tu nombre y email para recibir nuestras ofertas mayoristas y minoristas antes que nadie.
              </p>

              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Nombre</label>
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              {status === "error" && (
                <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded">{errorMsg}</p>
              )}

              <div className="pt-2 flex flex-col gap-3">
                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-opacity-90 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2"
                >
                  {status === "loading" ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : "¡Sí, quiero las promociones!"}
                </button>
                
                <button 
                  type="button"
                  onClick={closeModal}
                  className="text-xs font-bold text-gray-400 hover:text-primary transition-colors underline-offset-4 hover:underline py-2"
                >
                  No, no quiero las promociones exclusivas
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
