"use client";

import { useState } from "react";

const mockCharlas = [
  { id: "c1", titulo: "Cómo revender ropa desde cero", fecha: "2026-04-10", hora: "18:00", lugar: "Local San Martín 390", descripcion: "Charla para nuevos revendedores", cupos: 20, activa: true },
  { id: "c2", titulo: "Tendencias Otoño/Invierno 2026", fecha: "2026-04-25", hora: "17:00", lugar: "Local San Martín 390", descripcion: "Nuevas colecciones y cómo combinarlas", cupos: 15, activa: true },
  { id: "c3", titulo: "Armá tu primera orden mayorista", fecha: "2026-03-05", hora: "16:00", lugar: "Zoom Online", descripcion: "Paso a paso para tu primer pedido", cupos: null, activa: false },
];

export default function CharlasPage() {
  const [charlas, setCharlas] = useState(mockCharlas);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("18:00");
  const [lugar, setLugar] = useState("Local San Martín 390");
  const [descripcion, setDescripcion] = useState("");
  const [cupos, setCupos] = useState("");

  const toggleActiva = (id: string) => {
    setCharlas(prev => prev.map(c => c.id === id ? { ...c, activa: !c.activa } : c));
  };

  const eliminar = (id: string) => {
    if (confirm("¿Eliminar charla?")) {
      setCharlas(prev => prev.filter(c => c.id !== id));
    }
  };

  const guardar = () => {
    if (!titulo.trim() || !fecha) { alert("Título y fecha son obligatorios"); return; }
    setCharlas(prev => [...prev, {
      id: `c${Date.now()}`, titulo: titulo.trim(), fecha, hora, lugar, descripcion, cupos: cupos ? parseInt(cupos) : null, activa: true,
    }]);
    setTitulo(""); setFecha(""); setDescripcion(""); setCupos(""); setShowForm(false);
  };

  const formatFecha = (f: string) => {
    const d = new Date(f + "T12:00:00");
    return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  };

  const esFutura = (f: string) => new Date(f) >= new Date();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">🎤 Charlas</h1>
          <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>Gestioná las charlas y eventos</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="admin-btn admin-btn-primary">
          {showForm ? "✕ Cancelar" : "➕ Nueva charla"}
        </button>
      </div>

      {showForm && (
        <div className="admin-card mb-6 space-y-4">
          <h2 className="font-bold text-base">Nueva charla</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Título *</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="admin-input" placeholder="Ej: Cómo empezar a revender" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Fecha *</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Hora</label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Lugar</label>
              <input type="text" value={lugar} onChange={(e) => setLugar(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Cupos (opcional)</label>
              <input type="number" value={cupos} onChange={(e) => setCupos(e.target.value)} className="admin-input" placeholder="Sin límite" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Descripción</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="admin-input min-h-[60px]" placeholder="Descripción breve..." />
            </div>
          </div>
          <button onClick={guardar} className="admin-btn admin-btn-primary w-full admin-btn-lg">Guardar charla</button>
        </div>
      )}

      <div className="space-y-3">
        {charlas.sort((a, b) => b.fecha.localeCompare(a.fecha)).map(c => (
          <div key={c.id} className="admin-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ background: esFutura(c.fecha) ? "rgba(201,168,76,0.15)" : "var(--admin-bg)" }}>
                <span className="text-lg font-bold leading-none" style={{ color: esFutura(c.fecha) ? "var(--admin-accent)" : "var(--admin-text-muted)" }}>
                  {new Date(c.fecha + "T12:00:00").getDate()}
                </span>
                <span className="text-[9px] uppercase" style={{ color: "var(--admin-text-muted)" }}>
                  {new Date(c.fecha + "T12:00:00").toLocaleDateString("es-AR", { month: "short" })}
                </span>
              </div>
              <div>
                <p className="font-bold text-sm">{c.titulo}</p>
                <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
                  {formatFecha(c.fecha)} · {c.hora} · {c.lugar}
                  {c.cupos && ` · ${c.cupos} cupos`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleActiva(c.id)} className={`admin-badge cursor-pointer ${c.activa ? "admin-badge-success" : "admin-badge-muted"}`}>
                {c.activa ? "Visible" : "Oculta"}
              </button>
              <button onClick={() => eliminar(c.id)} className="admin-btn admin-btn-danger text-[10px] py-1">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
