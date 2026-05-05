"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
        localStorage.setItem("imperio_promo_seen", "true");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Ocurrió un error.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión.");
    }
  };

  return (
    <section className="bg-primary py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
          Recibí <span className="text-accent">promociones exclusivas</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base mb-8 max-w-lg mx-auto">
          Dejanos tu nombre y email para enterarte antes que nadie de nuestras ofertas mayoristas y minoristas.
        </p>

        {status === "success" ? (
          <div className="bg-white/10 border border-accent/30 rounded-xl py-6 px-8 inline-flex items-center gap-3">
            <svg className="w-6 h-6 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white font-bold">Listo, te mantendremos al tanto de las mejores ofertas.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-accent text-primary font-bold px-6 py-3 rounded-xl hover:scale-[1.03] transition-all shadow-lg disabled:opacity-70 whitespace-nowrap flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
              ) : "Obtener promociones"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-400 text-xs font-bold mt-3">{errorMsg}</p>
        )}
      </div>
    </section>
  );
}
