"use client";

import { useState } from "react";

const mockTestimonios = [
  { id: "t1", nombre: "María S.", texto: "Compré por mayor para revender en mi pueblo y la calidad es espectacular. Ya hice mi segundo pedido.", origen: "Instagram", publicado: true, destacado: true },
  { id: "t2", nombre: "Laura G.", texto: "Fui al local a buscar calzas y remeras. Excelente atención, me probaron lo que pedí y los precios son inmejorables.", origen: "Google Maps", publicado: true, destacado: true },
  { id: "t3", nombre: "Martín P.", texto: "La campera puffer me salió la mitad que en el centro comercial. Totalmente recomendable.", origen: "TikTok", publicado: true, destacado: false },
  { id: "t4", nombre: "Carolina V.", texto: "Muy buena ropa y buena onda del vendedor. Recomiendo 100%.", origen: "WhatsApp", publicado: false, destacado: false },
];

const origenes = ["Instagram", "TikTok", "WhatsApp", "Google Maps", "En persona"];

export default function TestimoniosPage() {
  const [testimonios, setTestimonios] = useState(mockTestimonios);
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");
  const [origen, setOrigen] = useState("Instagram");

  const togglePublicado = (id: string) => {
    setTestimonios(prev => prev.map(t => t.id === id ? { ...t, publicado: !t.publicado } : t));
  };

  const toggleDestacado = (id: string) => {
    setTestimonios(prev => prev.map(t => t.id === id ? { ...t, destacado: !t.destacado } : t));
  };

  const eliminar = (id: string) => {
    if (confirm("¿Eliminar testimonio?")) {
      setTestimonios(prev => prev.filter(t => t.id !== id));
    }
  };

  const guardar = () => {
    if (!nombre.trim() || !texto.trim()) { alert("Nombre y texto son obligatorios"); return; }
    setTestimonios(prev => [...prev, {
      id: `t${Date.now()}`, nombre: nombre.trim(), texto: texto.trim(), origen, publicado: true, destacado: false,
    }]);
    setNombre(""); setTexto(""); setShowForm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">⭐ Testimonios</h1>
          <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>{testimonios.filter(t => t.publicado).length} publicados</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="admin-btn admin-btn-primary">
          {showForm ? "✕ Cancelar" : "➕ Nuevo"}
        </button>
      </div>

      {/* Formulario nuevo */}
      {showForm && (
        <div className="admin-card mb-6 space-y-4">
          <h2 className="font-bold text-base">Nuevo testimonio</h2>
          <div>
            <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Nombre *</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del cliente" className="admin-input" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Testimonio *</label>
            <textarea value={texto} onChange={(e) => setTexto(e.target.value.slice(0, 300))} placeholder="Lo que dijo el cliente..." className="admin-input min-h-[80px]" />
            <p className="text-xs mt-1 text-right" style={{ color: "var(--admin-text-muted)" }}>{texto.length}/300</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Origen</label>
            <select value={origen} onChange={(e) => setOrigen(e.target.value)} className="admin-input">
              {origenes.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <button onClick={guardar} className="admin-btn admin-btn-primary w-full admin-btn-lg">Guardar y publicar</button>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {testimonios.map(t => (
          <div key={t.id} className="admin-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "var(--admin-accent)", color: "#0D0D0D" }}>
                    {t.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.nombre}</p>
                    <p className="text-[10px]" style={{ color: "var(--admin-text-muted)" }}>Vía {t.origen}</p>
                  </div>
                </div>
                <p className="text-sm italic leading-relaxed" style={{ color: "var(--admin-text-muted)" }}>"{t.texto}"</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => togglePublicado(t.id)} className={`admin-badge cursor-pointer ${t.publicado ? "admin-badge-success" : "admin-badge-muted"}`}>
                  {t.publicado ? "Publicado" : "Oculto"}
                </button>
                <button onClick={() => toggleDestacado(t.id)} className={`admin-badge cursor-pointer ${t.destacado ? "admin-badge-warning" : "admin-badge-muted"}`}>
                  {t.destacado ? "⭐ Destacado" : "Normal"}
                </button>
                <button onClick={() => eliminar(t.id)} className="admin-btn admin-btn-danger text-[10px] py-1">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
